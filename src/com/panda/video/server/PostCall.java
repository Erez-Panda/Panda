package com.panda.video.server;

import com.googlecode.objectify.Ref;
import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Index;
import com.googlecode.objectify.annotation.Load;


@Entity
public class PostCall extends PandaEntity {
	@Id Long postCallId;
	@Load Ref<Call> call;
	@Index Long callId;
	int doctorRating;
	int rating;
	String details;
	Long callLength;
	Long start;
	int sessionNumber;
	
}
