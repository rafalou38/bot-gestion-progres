import { JSDOM } from "jsdom";


const Headers = {
    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:130.0) Gecko/20100101 Firefox/130.0",
    "Accept-Language": "en-US,en;q=0.9",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
    "Accept-Encoding": "gzip, deflate, br, zstd"
};

export async function mangaInfo(url: string) {
    const response = await fetch(url, { headers: Headers });
    if (response.statusText != "OK") {
        return console.error("Failed to fetch", url, response.statusText);
    }

    const dom = new JSDOM(await response.text());
    const firstChapterLink = dom.window.document.querySelector("#chapterlist li");
    if (!firstChapterLink) return console.error("No first chapter link found on cypherscans for ", url);

    const index = firstChapterLink.getAttribute("data-num");
    if (!index) return console.error("No last chapter found on galaxy for ", url);

    return parseInt(index);
}

