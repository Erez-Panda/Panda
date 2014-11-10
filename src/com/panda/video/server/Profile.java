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
	String lang;
	String callHour;
	String callFreq;
	ArrayList<Boolean> foi = new ArrayList<Boolean>();
	ArrayList<Boolean> scheduleBy = new ArrayList<Boolean>();
	boolean onDemand;
	boolean sendInfo;
	public void update(DoctorProfile profile) {
		if (null != profile.lang){this.lang = profile.lang;}
		if (null != profile.callHour){this.callHour = profile.callHour;	}
		if (null != profile.callFreq){this.callFreq = profile.callFreq ;}
		if (null != profile.foi){this.foi = profile.foi;	}
		if (null != profile.scheduleBy){this.scheduleBy = profile.scheduleBy;}
	}
}

@Subclass(index=true)
class MedRepProfile extends Profile{
	String degree;
	String currentYear;
	String dgreeScanUrl;
	int experience;
	int workHours;
	String idNumber;
	boolean salesExperience;
	boolean pharmaExperience;
}

@Subclass(index=true)
class PharmaProfile extends Profile{
}

