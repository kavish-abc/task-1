#  functionality:
1. Post - it requires title as important and status from (progress, in-progress, completed), description and priority from (low, medium, high) as optional
2. Get- get all task on /tasks
   1. get task by id on /tasks/:id
   2. get filtered tasks on /tasks?status=pending , /tasks?priority=high , /tasks?sort=created_at&orderby=asc , /tasks?page=1&limit=10
3. Put- get task update on /tasks/:id
4. Patch- get task partially update on /tasks/:id
5. Delete- get task delete on /tasks/:id
6. health- get health of server on /health
