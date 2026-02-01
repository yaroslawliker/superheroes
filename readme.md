## Deploy
There are 4 simple steps to run the program:
1. Docker: use `docker compose up` to run minio (image storage) and postgres database.
2. Back-end: from separate terminal navigate to `cd back-end`, rename the `example.env` into `.env`. Run `npx prisma migrate dev` to init the database and then run `npm run dev`
3. Front-end: from separate terminal navigate to `cd front-end`, rename the `example.env` into `.env` and run `npm run dev`

## Dummy data
To have some data in the database, after running the docker and initializing the database but before running the back-end you may write `cd back-end` and `npm run script`.
This step is optional.
CAUTION: this will erase the existing postgres data, and also there is a memory leak in minio, so the volume should be deleted manualy, if the script is run multiple times.

## Assumptions
- Every superhero must have at least one image to be shown on list page proparly
- Authorization is not required since it is not mentioned in the task

## Room for improvement
Things, which could be made better if I had more time
- Better architecture of back-end end-points (split more login into functions/services)
- Write tests
- Catalog page would do great only for small amount of pages (<100)
- Back-end and front-end lounch may be easily implemented through Dockerfile and added to compose.yaml
- Ports, passwords, urls should be moved to global example.env and provided through compose.yaml to have one source of thruth
- Hero page is kind of ugly
