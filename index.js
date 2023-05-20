const core = require('@actions/core');
const github = require('@actions/github');
const axios = require('axios');

const CLICKUP_API = 'https://api.clickup.com/api/v2/task/';
const AUTO_DOWN_LABEL = 'auto-down';

try {
    const headBranch = github.context.payload.pull_request.head.ref;
    const targetBranch = github.context.payload.pull_request.base.ref;
    const title =  github.context.payload.pull_request.title;

    const reg = new RegExp(core.getInput('clickUpTaskIdReg'), 'i');
    const taskId = reg.exec(title);

    const labels = github.context.payload.pull_request.labels;
    if (labels.some(label => label.name === AUTO_DOWN_LABEL)) {
        console.log('Do not change ClickUp status');
        return;
    }

    let newStatus = null;
    if (targetBranch === 'master') {
        newStatus = 'PRODUCTION';
    } else if (targetBranch === 'develop') {
        newStatus = 'MERGED';
    } else if (targetBranch === 'staging') {
        newStatus = 'STG TESTING';
    } else if (targetBranch.indexOf('release') === 0) {
        newStatus = 'RELEASING TESTING';
    }

    console.log(`New Status: ${newStatus}`);
    if (newStatus) {
        const endpoint = `${CLICKUP_API}${taskId}?team_id=${core.getInput('clickUpTeamId')}&custom_task_ids=true`;
        axios.put(endpoint, {
            status: newStatus,
        }, {
            headers: {
                authorization: core.getInput('clickUpToken')
            }
        }).then((response) => {
            console.log(`Changed ${taskId} to ${newStatus} success`);
            const time = (new Date()).toTimeString();
            core.setOutput("time", time);
        }).catch(error => {
            core.setFailed(error.message);
        });
    }
} catch (error) {
    core.setFailed(error.message);
}