package com.panda.video.server;

public class Message {
	private String message;
	private String type;
	private Long userId;
	private Long id;
	private Long trainingId;
	
	public String getMessage(){
		return message;
	}
	
	public String getType(){
		return type;
	}
	
	public Long getUserId(){
		return userId;
	}
	
	public Long getId(){
		return id;
	}
	
	public Long getTrainingId(){
		return trainingId;
	}

}
