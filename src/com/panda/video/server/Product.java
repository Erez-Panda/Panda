package com.panda.video.server;

import com.googlecode.objectify.Ref;
import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;

@Entity
public class Product {
	@Id private Long productId;
	private Ref<User> creator;
	private Ref<Training>[] traningList;
	private Ref<Resource>[] resourcesList;
	private String name;
}
