package com.panda.video.server;

import java.util.ArrayList;

import com.googlecode.objectify.Ref;
import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;

@Entity
public class Test extends PandaEntity {
	@Id Long testId;
	ArrayList<Ref<Question>> Questions = new ArrayList<Ref<Question>>();
	
    public ArrayList<Ref<Question>> getQuestions() { return Questions; }
    public void addQuestion(Question value) { Questions.add(Ref.create(value)); }
}


