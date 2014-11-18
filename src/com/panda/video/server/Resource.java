package com.panda.video.server;

import com.googlecode.objectify.Ref;
import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Index;

@Entity
public class Resource extends PandaEntity{
	@Id Long resourceId;
	private Ref<User> uploader; 
	@Index Long uploaderId;  
	@Index Long productId; 
	@Index Long trainingId; 
	Long testId; 
	String url;
	String type;
	String name;
	String desc;
	String permission;
	Ref<User>[] users; 
	
    public User getUploader() { return uploader.get(); }
    public void setUploader(User value) { uploader = Ref.create(value); }

}
