import { success } from 'consola';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import fs from 'fs';

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(helmet());

app.get('/projects', (req, res) => {
	const projectsFile = fs.readFileSync('./src/data/projects.json', 'utf8');
	const projects = JSON.parse(projectsFile);
	return res.json(projects);
});

app.listen(port, () => {
	success(`Server is running on port ${port}`);
});
