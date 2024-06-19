const fs = require('node:fs')
const path = require('node:path');

const express = require('express');
const app = express();

const publicPath = path.join(__dirname, '..', 'public')

app.use(express.static(publicPath))

app.get('', (_, res) => {
	res.sendFile(path.join(publicPath, 'index.html'))
})

const exercisePath = path.join(__dirname, '..', 'exercise');
const getHtmlExercisePath = id => path.join(exercisePath, id, 'index.html')
const getCSSExercisePath = id => path.join(exercisePath, id, 'index.css');

/**
 * @param {string} content 
 * @param {string} keyword 
 * @param {string} appendContent 
 */
function appendAfter(content, keyword, appendContent) {
	const index = content.indexOf(keyword);

	return content.substring(0, index + keyword.length) + appendContent + content.substring(index + keyword.length)
}

const templateHtml = fs.readFileSync(path.join(__dirname, 'template.html'), 'utf-8');

app.get('/exercise/:id', (req, res) => {
	const id = req.params.id;
	let exerciseHtml = fs.readFileSync(getHtmlExercisePath(id), 'utf-8');

	exerciseHtml = appendAfter(exerciseHtml, '<head>', `\n\t<link rel="stylesheet" href="/exercise/${id}/index.css">`);
	exerciseHtml = appendAfter(exerciseHtml, '<body>', templateHtml)

	res.setHeader('Content-Type', 'text/html')
	res.send(exerciseHtml)
})

const getSolutionPath = id => path.join(exercisePath, id, 'solution.css');

app.get('/solution/:id', (req, res) => {
	const id = req.params.id;

	const solutionPath = getSolutionPath(id);
	const solution = fs.readFileSync(solutionPath, 'utf-8');

	res.setHeader('Content-Type', 'text/css');
	res.send(solution);
})

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => console.log(`Listen on http://localhost:3000/`));