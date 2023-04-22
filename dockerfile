# Build image:    "docker build -t scoretender ."
# Run image       "docker run -p 8000:8000 -e SUPABASE_URL= -e SUPABASE_KEY= -e PORT=8000 scoretender

FROM denoland/deno:latest

# The port that your application listens to.
# EXPOSE 8000

WORKDIR /app

# Run user as Deno.
USER deno

COPY deps.ts .
RUN deno cache deps.ts

ADD . .

RUN deno cache main.ts

# These steps will be re-run upon each file change in your working directory:

CMD ["run", "--allow-net", "--allow-env", "--allow-read", "main.ts"]
