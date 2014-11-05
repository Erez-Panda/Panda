package com.panda.video.server;

import java.util.Date;

import com.googlecode.objectify.Ref;
import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Ignore;
import com.googlecode.objectify.annotation.Load;

@Entity
public class Call extends PandaEntity{
	private String title;
	@Id private Long callId;
	@Load Ref<User> caller;
	@Ignore public String callerId; //for JSON construction 
	@Load Ref<User> callee;
	@Ignore public String calleeId; //for JSON construction 
	private Long start;
	private Long end;
	@Load Ref<Product> product;
	@Ignore public Long productId; //for JSON construction 
	@Load Ref<Resource[]> resourcesList;
	
    public Product getProduct() { return product.get(); }
    public void setProduct(Product value) { product = Ref.create(value); }
    
    public User getCaller() { return caller.get(); }
    public void setCaller(User value) { caller = Ref.create(value); }
    
    public User getCallee() { return callee.get(); }
    public void setCallee(User value) { callee = Ref.create(value); }

    
    public Resource[] getResourcesList() { return resourcesList.get(); }
    public void setResourcesList(Resource[] value) { resourcesList = Ref.create(value); }

}
