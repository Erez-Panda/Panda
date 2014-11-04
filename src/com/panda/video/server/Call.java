package com.panda.video.server;

import java.util.Date;

import com.googlecode.objectify.Ref;
import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;

@Entity
public class Call {
	@Id private Long callID;
	private Ref<User> caller;
	private Ref<User> calee;
	private Date start;
	private Date end;
	private Ref<Product> product;
	private Ref<Resource>[] resourcesList;

}
