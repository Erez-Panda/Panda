package com.panda.video.server;

import java.util.Date;

public class PandaEntity {
	private Date created;
	
	public Date getCreated(){
		return created;
	}
	
	public void Created(){
		created = new Date();
	}

}
