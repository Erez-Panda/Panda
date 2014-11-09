package com.panda.video.server;

import java.util.ArrayList;

import com.googlecode.objectify.Ref;
import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Ignore;
import com.googlecode.objectify.annotation.Load;

@Entity
public class Training extends PandaEntity{
	@Id private Long trainingId;
	@Load ArrayList<Ref<Resource>> resourcesList = new ArrayList<Ref<Resource>>();
	private String name;
	private Long dueDate;
	private Ref<User> creator;
	@Ignore public Long productId;
	
    public ArrayList<Ref<Resource>> getResources() { return resourcesList; }
    public void addResource(Resource value) { resourcesList.add(Ref.create(value)); }
    
    public User getCreator() { return creator.get(); }
    public void setCreator(User value) { creator = Ref.create(value); }
}
