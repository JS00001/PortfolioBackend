import { success } from 'consola';

import fileUpload from 'express-fileupload';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { v4 } from 'uuid';
import fs from 'fs';

const app = express();
const port = process.env.PORT || 8080;
const url = process.env.URL || 'http://localhost';

app.use(cors());
app.use(helmet());
app.use(
	fileUpload({
		createParentPath: true,
		safeFileNames: true,
		limits: {
			fileSize: 8 * 1024 * 1024, // 8 MB
		},
	})
);
app.use('/static', express.static('static'));

// View all portfolio projects
app.get('/projects', (req, res) => {
	const projectsFile = fs.readFileSync('./src/data/projects.json', 'utf8');
	const projects = JSON.parse(projectsFile);
	return res.json(projects);
});

// Upload images
app.post('/upload', (req, res) => {
	if (!req.files)
		return res.status(400).send({
			code: 400,
			message: 'No files were uploaded.',
		});

	const file = req.files.upload;
	const fileAddress = `static/${v4()}.${file.name.split('.').pop()}`;

	file.mv(`${fileAddress}`);

	return res.status(200).send({
		code: 200,
		message: `${url}:${port}/${fileAddress}`,
	});
});

app.listen(port, () => {
	success(`Server is running on port ${port}`);
});
