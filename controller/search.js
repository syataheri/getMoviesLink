const search = async (req, res, next) => {
    const movieName = req.body.movieName;
    const links = await getLinks(movieName);

    res.render("index", {
        links: links
    });
}





const getLinks = async (movieName) => {

    const puppeteer = require("puppeteer");

    movieName = movieName.split(" ");

    const preapedMovieName = movieName.join("+");;
    const cottegUrl = `https://moviecottage1.fun/?s=${preapedMovieName}`;
    const ifilmzUrl = `https://ifilmz.ir/?s=${preapedMovieName}`;
    const myfilmUrl = `https://my-film.pw/?s=${preapedMovieName}`;
    const vipofilmUrl = `https://vipofilm.com/?s=${preapedMovieName}`;

    const allLinks = {};


    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // movie cotteg website
    await page.goto(cottegUrl);

    let link = await page.evaluate(() =>
        Array.from(document.querySelectorAll('.postsFooter a[href]'), a => a.href)
    );
    if (link.length > 0) {
        await page.goto(link[0]);
        const cottegLinks = await page.evaluate(() =>
            Array.from(document.querySelectorAll('#dlHDDCollapse a[href]'), a => a.href)
        );

        allLinks.moviecotteg = cottegLinks;
    }

    // ifilmz website
    await page.goto(ifilmzUrl);

    link = await page.evaluate(() =>
        Array.from(document.querySelectorAll('.postsFooter a[href]'), a => a.href)
    );
    if (link.length > 0) {

        await page.goto(link[0]);

        const ifilmz = await page.evaluate(() =>
            Array.from(document.querySelectorAll('.dl-inner a[href]'), a => a.href)
        );

        for (let i = 0; i < ifilmz.length; i++) {
            ifilmz.splice(i, 1);
        }

        allLinks.ifilmz = ifilmz;
    }


    // myfilm website
    await page.goto(myfilmUrl);

    link = await page.evaluate(() =>
        Array.from(document.querySelectorAll('.greenkey'), a => a.href)
    );
    if (link.length > 0) {

        await page.goto(link[0]);

        const myfilms = await page.evaluate(() => {
            if (document.querySelectorAll(".title"), a => a.textContent === " لینک های دانلود زبان اصلی ") {
                return Array.from(document.querySelectorAll('.item a[href]'), a => a.href)
            }
        }
        );
        const myfilm = [];
        for (film of myfilms) {
            if (!film.includes("Dubbed")) {
                myfilm.push(film);
            }

        }

        allLinks.myfilm = myfilm;
    }


    // vipofilm website
    await page.goto(vipofilmUrl);

    link = await page.evaluate(() =>
        Array.from(document.querySelectorAll('.more'), a => a.href)
    );
    if (link.length > 0) {

        await page.goto(link[0]);

        const vipofilms = await page.evaluate(() =>
            Array.from(document.querySelectorAll('.new_dl_link_row a[href]'), a => a.href)
        );
        const vipofilm = [];
        for (film of vipofilms) {
            if (!film.includes("Dubbed")) {
                vipofilm.push(film);
            }

        }

        allLinks.vipofilm = vipofilm;
    }
    await browser.close();
    return allLinks;
}


module.exports = search;