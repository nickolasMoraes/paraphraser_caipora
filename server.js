const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.post('/paraphrase', async (req, res) => {
    const { text } = req.body;

    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto('https://quillbot.com/');

        await page.waitForSelector('a.css-11a68w4');
        await page.click('a.css-11a68w4');

        await page.waitForSelector('button.MuiButton-root.css-1001izg');
        await page.click('button.MuiButton-root.css-1001izg');

        await page.waitForSelector('div ::-p-text(Portuguese)');
        await page.click('div ::-p-text(Portuguese)');

        await page.waitForSelector('div.Pane.vertical.Pane1');
        await page.waitForSelector('div.MuiGrid-root.css-rfnosa');
        await page.waitForSelector('div.MuiBox-root.css-k037ti');
        await page.waitForSelector('#paraphraser-input-box');

        await page.type('#paraphraser-input-box', text);

        // Aguardar 2 segundos
        await page.evaluate(() => {
            return new Promise(resolve => {
                setTimeout(resolve, 2000);
            });
        });

        // Pressionar "Ctrl + Enter"
        await page.keyboard.down('Control'); // Pressionar a tecla "Ctrl"
        await page.keyboard.press('Enter'); // Pressionar a tecla "Enter"
        await page.keyboard.up('Control'); // Liberar a tecla "Ctrl"

        // Aguardar 2 segundos
        await page.evaluate(() => {
            return new Promise(resolve => {
                setTimeout(resolve, 2000);
            });
        });

        // Recuperar o conteúdo da div
        const paraphrasedText = await page.evaluate(() => {
            const div = document.querySelector('#paraphraser-output-box');
            return div ? div.textContent : null;
        });

        // console.log("Conteúdo da div #paraphraser-output-box:", paraphrasedText);

        await browser.close(); //fecha o navegador

        res.json({ paraphrasedText });
    } catch (error) {
        console.error('Erro ao parafrasear:', error);
        res.status(500).json({ error: 'Erro ao parafrasear o texto' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor iniciado na porta ${PORT}`);
});
