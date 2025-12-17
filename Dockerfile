# Use official PostgreSQL image
FROM postgres:18-alpine

ENV POSTGRES_DB=app_db
ENV POSTGRES_USER=app_user
ENV POSTGRES_PASSWORD=app_password

EXPOSE 5432

CMD ["postgres"]
