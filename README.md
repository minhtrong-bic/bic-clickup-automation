# Auto change ClickUp Ticket Status Github action

This action changes ClickUp ticket by get ticket id by using RegExp and looking up the Id from PR's title
The status of the ticket is determined by the target branch of PR

## Inputs

### `clickUpTaskIdReg`
*Javascript regular expression to detect task id.*

**Required**.

**Default**: 'BEIN-\d+'

### `clickUpTeamId`
*ClickUp team Id, should be a Github secret*

**Required**.


### `clickUpToken`
*ClickUp Personal Token that is used to call ClickUp API, should be a Github secret*

**Required**.

### `triggerPrefixes`
*List of PR prefixes will trigger automation status changing, separated by comma.*

**Required**.

**Example**: 'DEV,STG,RLS,PRD'

## Example workflow file
```yaml
on:
  pull_request:
    types:
      - closed
jobs:
  change_clickup_status:
    if: github.event.pull_request.merged == true
    runs-on: ubuntu-latest
    name: Change ClickUp Ticket Status
    steps:
      - name: Change ClickUp Ticket Status
        id: auto_change_clickup_status
        uses: minhtrong-bic/bic-clickup-automation@v1.0.0
        with:
          clickUpTaskIdReg: 'BEIN-\d+'
          clickUpTeamId: ${{ secrets.CLICKUP_TEAM_ID }}
          clickUpToken: ${{ secrets.CLICKUP_TOKEN }}
          triggerPrefixes: 'DEV,STG,RLS,PRD'
```