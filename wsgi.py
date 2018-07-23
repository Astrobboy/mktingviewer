from app import app  as application

if __name__ == "__main__":
	application.run(threaded=True, host="0.0.0.0")