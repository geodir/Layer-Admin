package com.soluciones.extension.layer.service;

import java.util.Collection;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.soluciones.extension.layer.GeodirLayer;

import io.springlets.data.domain.GlobalSearch;

public interface GeodirLayerService {

	public Page<GeodirLayer> findAll(GlobalSearch globalSearch, Pageable pageable);

	public long count();

	public List<GeodirLayer> findByIds(Collection<Long> ids);
	
	public GeodirLayer findById(int pk);
	
}
