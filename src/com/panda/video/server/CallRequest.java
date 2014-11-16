package com.panda.video.server;

import java.util.ArrayList;

import com.googlecode.objectify.Ref;
import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Index;
import com.googlecode.objectify.annotation.Load;

@Entity
public class CallRequest extends PandaEntity {
	@Id Long callRequestId;
	@Load Ref<User> creator;
	@Load Ref<User> respodner;
	@Load Ref<Product> product;
	Long start;
	@Index boolean active;
	ArrayList<Long> bestMatchs = new ArrayList<Long>();
	
    public Product getProduct() { return product.get(); }
    public void setProduct(Product value) { product = Ref.create(value); }
    
    public User getCreator() { return creator.get(); }
    public void setCreator(User value) { creator = Ref.create(value); }
	
    public ArrayList<Long> getBestMatchs() { return bestMatchs; }
    public void addBestMatch(Long value) { bestMatchs.add(value); }
    
    public User getRespodner() { return respodner.get(); }
    public void setRespodner(User value) { respodner = Ref.create(value); }
}
