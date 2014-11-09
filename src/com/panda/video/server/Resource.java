package com.panda.video.server;

import com.googlecode.objectify.Ref;
import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Ignore;

@Entity
public class Resource extends PandaEntity{
	@Id private Long resourceId;
	private Ref<User> uploader; 
	@Ignore public String uploaderId; //for JSON construction 
	private String url;
	private String type;
	private String name;
	private String permission;
	private Ref<User>[] users; 
	
    public User getUploader() { return uploader.get(); }
    public void setUploader(User value) { uploader = Ref.create(value); }

}
