package com.panda.video.server;

import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
@Entity
public class ResourceData extends PandaEntity {
	@Id Long id;
	private byte[] data;
	String fileName;
	String contentType;
	long sizeInBytes;
	
	public ResourceData(){}
	public ResourceData(String fileName, String contentType, long sizeInBytes){
		this.fileName = fileName;
		this.contentType = contentType;
		this.sizeInBytes = sizeInBytes;
	}
	public void setData(byte[] data){this.data = data;}
	public byte[] getData(){return data;}
	
	

}
