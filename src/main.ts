import { getInput, setOutput, setFailed, info } from "@actions/core";
import * as github from "@actions/github";

async function run(): Promise<void> {
	try {
		const token = getInput("token");
		const message = getInput("message");
		const email = getInput("email");
		const name = getInput("name");
		const octokit = github.getOctokit(token);
		const eventPath = process.env.GITHUB_EVENT_PATH;
		if (!eventPath) {
			throw new Error("EventPath not reserved");
		}
		const event = require(eventPath);

		const commit_sha = (event?.pull_request?.head?.sha ||
			process.env.GITHUB_SHA) as string;
		const ref = (event?.pull_request?.head?.ref as string).substr(4)
		const full_repository = process.env.GITHUB_REPOSITORY as string;
		const [owner, repo] = full_repository.split("/");

		info(`getCommit with ${commit_sha}`);
		const {
			data: { tree },
		} = await octokit.git.getCommit({ repo, owner, commit_sha });

		info(`createCommit with parents:${commit_sha}, tree: ${tree.sha}`);
		const {
			data: { sha: newSha },
		} = await octokit.git.createCommit({
			repo,
			owner,
			parents: [commit_sha],
			tree: tree.sha,
			message,
			author: { email, name },
		});

		info(`updateRef with ref:${ref}, sha: ${newSha}`);
		await octokit.git.updateRef({ repo, owner, ref, sha: newSha });
		setOutput("commit", newSha);
	} catch (error) {
		setFailed(error.message);
	}
}

run();
