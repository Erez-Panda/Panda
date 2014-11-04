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
    }

    public static Objectify ofy() {
        return ObjectifyService.ofy();
    }

    public static ObjectifyFactory factory() {
        return ObjectifyService.factory();
    }



}

