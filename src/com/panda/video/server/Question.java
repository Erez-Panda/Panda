package com.panda.video.server;

import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;

@Entity
public class Question extends PandaEntity {
		@Id Long qId;
		String question;
		String[] answers;
		int correctAns;
}
