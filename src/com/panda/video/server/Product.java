package com.panda.video.server;

import java.util.ArrayList;

import com.googlecode.objectify.Ref;
import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Ignore;
import com.googlecode.objectify.annotation.Load;

@Entity
public class Product extends PandaEntity{
	@Id private Long productId;
	private Ref<User> creator;
	@Ignore public String creatorId; //for JSON construction 
	@Load ArrayList<Ref<Resource>> resourcesList = new ArrayList<Ref<Resource>>();
	@Load ArrayList<Ref<Training>> traningList = new ArrayList<Ref<Training>>();
	private String name;
	private Long deliveryDate;
	private String maturityPhase;
	private Long endDate;
	private int numOfCalls;
	private String hcp;
	
    public User getCreator() { return creator.get(); }
    public void setCreator(User value) { creator = Ref.create(value); }
	
    public ArrayList<Ref<Resource>> getResources() { return resourcesList; }
    public void addResource(Resource value) { resourcesList.add(Ref.create(value)); }
    
    public ArrayList<Ref<Training>> getTrainings() { return traningList; }
    public void addTraining(Training value) { traningList.add(Ref.create(value)); }
}
