package com.panda.video.server;

import com.googlecode.objectify.Ref;
import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;

@Entity
public class Resource {
	@Id private Long resourceId;
	private Ref<User> uploader; 
	private String url;
	private String type;
	private String name;
	private String permission;
	private Ref<User>[] users; 
}
