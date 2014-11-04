package com.panda.video.server;

import com.googlecode.objectify.Ref;
import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;

@Entity
public class Training {
	@Id private Long traningId;
	private Ref<Resource>[] resourcesList;
	private String name;
	private Ref<User> creator;
}
