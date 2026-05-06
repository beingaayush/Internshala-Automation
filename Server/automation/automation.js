const puppeteer = require("puppeteer");
const fs = require("fs");                   //file system module for cookies handling & resume upload/read
const path = require("path");
const Resume = require("../models/Resume");

// ===================== ANSWER LOGIC =====================
function getAnsw(question, resume) {
  const q = question.toLowerCase();

  if (q.includes("why should we hire")) {
    return `I am a motivated candidate with strong skills in ${
      resume.skills?.programmingLanguages?.join(", ") || "software development"
    }. I am eager to learn and contribute effectively.`;
  }

  if (q.includes("strength")) {
    return "Quick learner, problem solver, and consistent performer.";
  }

  if (q.includes("weakness")) {
    return "I sometimes over-focus on details, but I manage it well with planning.";
  }

  if (q.includes("experience")) {
    return resume.experience?.length
      ? resume.experience[0].description
      : "I am a fresher but have strong project experience.";
  }

  if (q.includes("skills")) {
    return Object.values(resume.skills || {})
      .flat()
      .join(", ");
  }

  return "I am interested in this opportunity and believe I am a good fit.";
}

// ===================== RESUME FETCH =====================
async function getResume(userId) {
  return await Resume.findOne({ user: userId }).lean();
}

// ===================== MAIN AUTOMATION =====================
async function startAutomation(userId) {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ["--start-maximized"],
  });

  const page = await browser.newPage();

  // ------------------ COOKIES SETUP ------------------
  const cookiesDir = path.join(__dirname, "cookies");
  if (!fs.existsSync(cookiesDir)) fs.mkdirSync(cookiesDir);

  const cookiesPath = path.join(cookiesDir, `${userId}.json`);

  if (fs.existsSync(cookiesPath)) {
    const cookies = JSON.parse(fs.readFileSync(cookiesPath, "utf-8"));
    await page.setCookie(...cookies);
    console.log("✅ Cookies loaded for user:", userId);
  }

  // ------------------ LOGIN FLOW ------------------
  await page.goto("https://internshala.com/", { waitUntil: "networkidle2" });

  const isLoggedIn = await page.evaluate(
    () => !!document.querySelector('a[data-label="profile"]')
  );

  if (!isLoggedIn) {
    console.log("Not logged in. Waiting for manual login + CAPTCHA...");
    await page.waitForSelector('a[data-label="profile"]', { timeout: 0 });

    const cookies = await page.cookies();
    fs.writeFileSync(cookiesPath, JSON.stringify(cookies, null, 2));
    console.log("Cookies saved for user:", userId);
  } else {
    console.log("Already logged in via cookies");
  }

  // ------------------ FETCH RESUME ------------------
  let resume;
  try {
    resume = await getResume(userId);
    if (!resume) throw new Error("Resume not found");
  } catch (err) {
    console.error("Resume fetch failed:", err.message);
    await browser.close();
    return;
  }

  // ------------------ PAGINATION LOOP ------------------
  let pageNum = 1;
  let hasMore = true;

  while (hasMore) {
    console.log(`Searching internships - Page ${pageNum}...`);
    await page.goto(`https://internshala.com/internships?page=${pageNum}`, {
      waitUntil: "networkidle2",
    });

    await page.waitForTimeout(2000);

    const internshipLinks = await page.$$eval(
      ".internship_meta a.view_detail_button",
      (links) => links.map((link) => link.href)
    );

    if (internshipLinks.length === 0) {
      console.log("No more internships found.");
      hasMore = false;
      break;
    }

    console.log(`Found ${internshipLinks.length} internships on page ${pageNum}`);

    // ------------------ APPLY LOOP ------------------
    for (const link of internshipLinks) {
      try {
        const newPage = await browser.newPage();
        await newPage.goto(link, { waitUntil: "networkidle2" });

        // Apply button
        const applyBtn = await newPage.$('button#continue_button, button#easy_apply_button, button#apply_now_button');
        if (!applyBtn) {
          console.log("No apply button:", link);
          await newPage.close();
          continue;
        }

        await applyBtn.click();
        await newPage.waitForTimeout(1000);

        // ------------------ QUESTIONS AUTO-FILL ------------------
        const fields = await newPage.$$(
          "textarea, input[type='text'], input[type='number']"
        );

        for (let field of fields) {
          const label = await newPage.evaluate(
            (el) => el.closest(".form-group")?.innerText || "",
            field
          );
          const answer = getAnswer(label, resume);
          await field.type(answer, { delay: 30 });
        }

        // Submit application
        const submitBtn = await newPage.$("button[type='submit']");
        if (submitBtn) {
          await submitBtn.click();
          console.log("Applied successfully:", link);
          await newPage.waitForTimeout(2000);
        }

        await newPage.close();
      } catch (err) {
        console.log("Failed to apply:", link, err.message);
      }
    }

    pageNum++;
  }

  console.log("Automation completed for user:", userId);
  await browser.close();
}

module.exports = startAutomation;