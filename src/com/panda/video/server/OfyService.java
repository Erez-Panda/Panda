package com.panda.video.server;

import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyFactory;
import com.googlecode.objectify.ObjectifyService;

public class OfyService {
    static {
        factory().register(User.class);
        factory().register(Profile.class);
        factory().register(MedRepProfile.class);
        factory().register(DoctorProfile.class);
        factory().register(PharmaProfile.class);
        factory().register(Product.class);
        factory().register(Call.class);
        factory().register(Resource.class);
        factory().register(Training.class);
        factory().register(ResourceData.class);
        factory().register(StaticEntity.class); 
        factory().register(DegreeOption.class);
        factory().register(DoctorSpecialty.class);
        factory().register(ResourceType.class);
        factory().register(LanguageOption.class);
        factory().register(CallHourOption.class);
        factory().register(CallFrequencyOption.class);
        factory().register(HcpSegmentOption.class);
        factory().register(CallQuantityOption.class); 
        factory().register(FieldOfInterestOption.class); 
        factory().register(PostCall.class); 
        factory().register(CallRequest.class); 
        factory().register(Test.class);
        factory().register(Question.class);
    }

    public static Objectify ofy() {
        return ObjectifyService.ofy();
    }

    public static ObjectifyFactory factory() {
        return ObjectifyService.factory();
    }



}

