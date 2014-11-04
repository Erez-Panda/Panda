package com.panda.video.server;

import java.util.ArrayList;

import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Subclass;

@Entity
public class Profile {
	@Id Long id;

}

@Subclass(index=true)
class DoctorProfile extends Profile{
	private String lang;
	private String callHour;
	private String callFreq;
	ArrayList<Boolean> foi = new ArrayList<Boolean>();
	ArrayList<Boolean> scheduleBy = new ArrayList<Boolean>();
	private boolean onDemand;
	private boolean sendInfo;
}

@Subclass(index=true)
class MedRepProfile extends Profile{
	private String degree;
	private String currentYear;
	private String dgreeScanUrl;
	private int experience;
	private int workHours;
	private String idNumber;
	private boolean salesExperience;
	private boolean pharmaExperience;
}

@Subclass(index=true)
class PharmaProfile extends Profile{
}

