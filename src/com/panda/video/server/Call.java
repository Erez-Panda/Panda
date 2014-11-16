package com.panda.video.server;

import java.util.ArrayList;
import java.util.Date;

import com.googlecode.objectify.Ref;
import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Ignore;
import com.googlecode.objectify.annotation.Index;
import com.googlecode.objectify.annotation.Load;

@Entity
public class Call extends PandaEntity{
	private String title;
	@Id private Long callId;
	@Load Ref<User> caller;
	@Ignore public Long callerId; //for JSON construction 
	@Load Ref<User> callee;
	@Ignore public Long calleeId; //for JSON construction 
	@Index Long start;
	Long end;
	@Load Ref<Product> product;
	@Ignore public Long productId; //for JSON construction 
	@Load ArrayList<Ref<Resource>> resourcesList = new ArrayList<Ref<Resource>>();
	
    public Product getProduct() { return product.get(); }
    public void setProduct(Product value) { product = Ref.create(value); }
    
    public User getCaller() { return caller.get(); }
    public void setCaller(User value) { caller = Ref.create(value); }
    
    public User getCallee() { return callee.get(); }
    public void setCallee(User value) { callee = Ref.create(value); }
	
    public ArrayList<Ref<Resource>> getResources() { return resourcesList; }
    public void addCall(Resource value) { resourcesList.add(Ref.create(value)); }
    
    public Long getId() {return callId;}

}
