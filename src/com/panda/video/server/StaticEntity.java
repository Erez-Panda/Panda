package com.panda.video.server;

import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Subclass;

@Entity
public class StaticEntity {
	@Id Long id;
	String name;
	
	public StaticEntity(){}
	public StaticEntity(StaticEntity entity){
		this.name = entity.name;
	}
	
}
@Subclass(index=true)
class DegreeOption extends StaticEntity{
	public DegreeOption(){}
	public DegreeOption(StaticEntity entity){
		super(entity);
	}
}

@Subclass(index=true)
class DoctorSpecialty extends StaticEntity{
	public DoctorSpecialty(){}
	public DoctorSpecialty(StaticEntity entity){
		super(entity);
	}
}

@Subclass(index=true)
class ResourceType extends StaticEntity{
	public ResourceType(){}
	public ResourceType(StaticEntity entity){
		super(entity);
	}
}

@Subclass(index=true)
class LanguageOption extends StaticEntity{
	public LanguageOption(){}
	public LanguageOption(StaticEntity entity){
		super(entity);
	}
}

@Subclass(index=true)
class CallHourOption extends StaticEntity{
	public CallHourOption(){}
	public CallHourOption(StaticEntity entity){
		super(entity);
	}
}

@Subclass(index=true)
class CallFrequencyOption extends StaticEntity{
	public CallFrequencyOption(){}
	public CallFrequencyOption(StaticEntity entity){
		super(entity);
	}
}

@Subclass(index=true)
class HcpSegmentOption extends StaticEntity{
	public HcpSegmentOption(){}
	public HcpSegmentOption(StaticEntity entity){
		super(entity);
	}
}

@Subclass(index=true)
class CallQuantityOption extends StaticEntity{
	public CallQuantityOption(){}
	public CallQuantityOption(StaticEntity entity){
		super(entity);
	}
}
