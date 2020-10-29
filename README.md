# Create Empty Commit Github Action

빈 커밋을 만들어주는 깃헙 액션입니다.

> 쓸모없어 보이지만, 쓰일 일이 있습니다.. ㅎㅎ

```yaml
on: # rebuild any PRs and main branch changes
  pull_request:
jobs:
    uses: tbvjaos510/empty-commit-action@0.0.2
    with:
        token: ${{ secrets.GITHUB_TOKEN }}
        email: helloworld@naver.com
        name: tbvjaos510
        message: empty commit
```
