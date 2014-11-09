package com.panda.video.server;

public class Message {
	private String message;
	private String type;
	private Long userId;
	
	public String getMessage(){
		return message;
	}
	
	public String getType(){
		return type;
	}
	
	public Long getUserId(){
		return userId;
	}

}
