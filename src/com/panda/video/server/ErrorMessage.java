package com.panda.video.server;

public class ErrorMessage {
	private boolean error;
	private String message;
	public ErrorMessage(String msg){
		error = true;
		message = msg;
	}

}
