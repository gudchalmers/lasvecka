FROM python:3-alpine

COPY . /app

WORKDIR /app

RUN pip install -r  requirements.text

ENTRYPOINT ["python"]

CMD ["app.py"]

EXPOSE 5000
