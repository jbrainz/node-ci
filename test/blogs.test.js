const Page = require("./helpers/page")

let page

beforeEach(async () => {
  page = await Page.build()
  await page.goto("http://localhost:3000")
})

afterEach(async () => {
  await page.close()
})

test("when logged in, can see blog create form", async () => {
  await page.login()
  await page.click("a.btn-floating")
  const label = await page.getContentOf("form label")

  expect(label).toEqual("Blog Title")
})
