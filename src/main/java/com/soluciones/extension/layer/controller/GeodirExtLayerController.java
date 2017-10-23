package com.soluciones.extension.layer.controller;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.convert.ConversionService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.soluciones.extension.layer.GeodirLayer;
import com.soluciones.extension.layer.GeodirLayerExtension;
import com.soluciones.extension.layer.GeodirLayerManager;
import com.soluciones.extension.layer.LayerOption;
import com.soluciones.extension.layer.LayerOptionsExtension;
import com.soluciones.extension.layer.MapExtensionType;
import com.soluciones.extension.layer.service.GeodirExternalLayerService;
import com.soluciones.extension.layer.service.GeodirLayerService;


import io.springlets.data.domain.GlobalSearch;
import io.springlets.data.web.datatables.ConvertedDatatablesData;
import io.springlets.data.web.datatables.Datatables;
import io.springlets.data.web.datatables.DatatablesColumns;
import io.springlets.data.web.datatables.DatatablesPageable;

@Controller
@RequestMapping("geodir/ext/layer")
public class GeodirExtLayerController {

	@Autowired
	private GeodirLayerService geodirLayerService;

	@Autowired
	private GeodirLayerManager geodirLayerManager;

	@Autowired
	private ConversionService conversionService;

	@Value("${geodir.ext.layer:extension/layer/layer-layout}")
	private String baseTh;

	@Autowired
	protected GeodirLayerExtension geodirLayerExtension;
	
	@Autowired
	private GeodirExternalLayerService geodirExternalLayerService;

	
	@RequestMapping("/options/{id}")
	@ResponseBody
	public ResponseEntity<Map<String, LayerOption>> ajaxFilters(@PathVariable("id") Integer id) {
		Map<String, LayerOption> layerOptions = new TreeMap<>();
		Iterator<String> it = geodirLayerExtension.getExtensionTypesNames().get(MapExtensionType.LAYER_OPTION_EXTENSION).keySet().iterator();
		while (it.hasNext()) {
			String key = it.next();
			LayerOptionsExtension<?> extension =(LayerOptionsExtension<?>) geodirLayerExtension.getExtensionTypesNames().get(MapExtensionType.LAYER_OPTION_EXTENSION).get(key);
			layerOptions.put(key, extension.loadOptionExtention(id));
		}
		return ResponseEntity.ok(layerOptions);
	}
	
	@GetMapping(produces = Datatables.MEDIA_TYPE, name = "datatables", value = "/dt")
	@ResponseBody
	public ResponseEntity<ConvertedDatatablesData<GeodirLayer>> datatables(DatatablesColumns datatablesColumns,
			GlobalSearch search, DatatablesPageable pageable, @RequestParam("draw") Integer draw) {
		Page<GeodirLayer> timers = geodirLayerService.findAll(search, pageable);
		long totalTimersCount = timers.getSize();
		if (search != null && StringUtils.isNotBlank(search.getText())) {
			totalTimersCount = geodirLayerService.count();
		}
		ConvertedDatatablesData<GeodirLayer> datatablesData = new ConvertedDatatablesData<GeodirLayer>(timers,
				totalTimersCount, draw, conversionService, datatablesColumns);
		return ResponseEntity.ok(datatablesData);
	}

	@GetMapping("/json")
	@ResponseBody
	public ResponseEntity<List<GeodirLayer>> layerList() {
		List<GeodirLayer> geodirLayers = new ArrayList<>();
		for (GeodirLayer geodirLayer : geodirLayerManager.getLayerConfiguration().getLayerlist()) {
			geodirLayers.add(0, geodirLayer);
		}
		return ResponseEntity.ok(geodirLayers);
	}

	@RequestMapping("/all")
	public String ajaxFilters(Model model) {
		model.addAttribute("layers", geodirLayerManager.getLayerConfiguration().getLayerlist());
		return this.baseTh + " :: layer-configuration";
	}

	@PutMapping(value = "batch/{ids}", name = "addBatch")
	@ResponseBody
	public ResponseEntity<List<GeodirLayer>> addBatch(@PathVariable("ids") Collection<Long> ids) {

		List<GeodirLayer> selected = geodirLayerService.findByIds(ids);
		for (int i = 0; i < selected.size(); i++) {
			// selected.get(i).
			selected.get(i).setQuery(geodirLayerManager.getLayerConfiguration().generateSQL());
			geodirLayerManager.getLayerConfiguration().addlayer(selected.get(i));
			selected.get(i).setPath(
					geodirLayerManager.getLayerConfiguration().getConfigurationPath() + selected.get(i).getId());
		}
		geodirLayerManager.saveConfiguration();
		return ResponseEntity.ok(selected);
	}

	@PutMapping(value = "reorder/{ids}", name = "reorderlayers")
	@ResponseBody
	public ResponseEntity<?> reorderlayers(@PathVariable("ids") Collection<Long> ids) {
		Map<Integer, Integer> id_order = new TreeMap<>();
		int order = 0;
		for (Long id : ids) {
			id_order.put(id.intValue(), order);
			order++;
		}
		for (int i = 0; i < geodirLayerManager.getLayerConfiguration().getLayerlist().size(); i++) {
			int temp_id = geodirLayerManager.getLayerConfiguration().getLayerlist().get(i).getId();
			geodirLayerManager.getLayerConfiguration().getLayerlist().get(i).setOrder(id_order.get(temp_id));
		}
		geodirLayerManager.getLayerConfiguration().sort();
		geodirLayerManager.saveConfiguration();
		return ResponseEntity.ok().build();
	}

	@PutMapping(value = "changevisible/{id}", name = "changevisible")
	@ResponseBody
	public ResponseEntity<?> changeVisible(@PathVariable("id") int id, @RequestParam("visible") boolean visible) {
		for (int i = 0; i < geodirLayerManager.getLayerConfiguration().getLayerlist().size(); i++) {
			if (geodirLayerManager.getLayerConfiguration().getLayerlist().get(i).getId() == id) {
				geodirLayerManager.getLayerConfiguration().getLayerlist().get(i).setVisible(visible);
				break;
			}
		}
		geodirLayerManager.saveConfiguration();
		return ResponseEntity.ok().build();
	}

	@DeleteMapping(value = "delete/{id}", name = "delete")
	@ResponseBody
	public ResponseEntity<Integer> deleteLayer(@PathVariable("id") int id) {
		for (GeodirLayer layer : geodirLayerManager.getLayerConfiguration().getLayerlist()) {
			if (layer.getId() == id) {
				geodirLayerManager.getLayerConfiguration().removelayer(layer);
				break;
			}
		}
		geodirLayerManager.saveConfiguration();
		return ResponseEntity.ok(geodirLayerManager.getLayerConfiguration().getIdLayerSelect());
	}

	@PutMapping(value = "select/{id}", name = "select")
	@ResponseBody
	public ResponseEntity<Integer> selectLayer(@PathVariable("id") int id) {
		for (int i = 0; i < geodirLayerManager.getLayerConfiguration().getLayerlist().size(); i++) {
			if (geodirLayerManager.getLayerConfiguration().getLayerlist().get(i).getId() == id) {
				geodirLayerManager.getLayerConfiguration()
						.setLayer(geodirLayerManager.getLayerConfiguration().getLayerlist().get(i));
				break;
			}
		}
		geodirLayerManager.saveConfiguration();
		return ResponseEntity.ok(geodirLayerManager.getLayerConfiguration().getIdLayerSelect());
	}
	
	@PutMapping(value = "changealias/{id}", name = "changealias")
	@ResponseBody
	public ResponseEntity<Integer> changeAliasLayer(@PathVariable("id") int id, @RequestParam("newAlias") String newAlias){
		for (int i = 0; i < geodirLayerManager.getLayerConfiguration().getLayerlist().size(); i++) {
			if(geodirLayerManager.getLayerConfiguration().getLayerlist().get(i).getId() == id) {
				geodirLayerManager.getLayerConfiguration().getLayerlist().get(i).setAlias(newAlias);
			}
			break;
		}
		geodirLayerManager.saveConfiguration();
		return ResponseEntity.ok(geodirLayerManager.getLayerConfiguration().getIdLayerSelect());
	}
	
	
	@PutMapping(value = "addexternalwms", name = "addexternalwms")
	@ResponseBody
	public ResponseEntity<List<GeodirLayer>> addExternalLayerWMS(@RequestBody GeodirLayer geodirLayer){
		List<GeodirLayer> selected = new ArrayList<>();
		geodirLayer.setLayerId(99999);
		geodirLayer.setEditable(false);
		geodirLayer.setVisible(true);
		for (int i = 0; i < geodirLayerManager.getLayerConfiguration().getLayerlist().size(); i++) {
			if(geodirLayer.getAlias().toLowerCase().equals(geodirLayerManager.getLayerConfiguration().getLayerlist().get(i).getAlias().toLowerCase())) {
				geodirLayer.setAlias(geodirLayer.getAlias()+"_1");
				break;
			}
		}
		geodirLayerManager.getLayerConfiguration().addlayer(geodirLayer);
		geodirLayerManager.saveConfiguration();
		selected.add(geodirLayer);
		return ResponseEntity.ok(selected);
	}
	
	
	@GetMapping(value = "listexternallayers", name ="listexternallayers")
	public ResponseEntity<List<GeodirLayer>> listExternalLayers(@RequestParam("url_Server") String urlServer, @RequestParam("typeServer") String typeServer,@RequestParam("version") String wmsVersion){
		
		switch (typeServer) {
			case "GEOSERVER":
				urlServer = urlServer + "/ows?";
				break;
			case "MAPSERVER":
				urlServer = urlServer + "/WMSSERVER?";
				break;
	
			default:
				urlServer = urlServer + "/wms?";
				break;
		}
		urlServer = urlServer + "version="+wmsVersion+"&request=GetCapabilities&service=WMS";
		
		List<GeodirLayer> layers = geodirExternalLayerService.getLayers(urlServer);
		if(layers == null) {
			layers = new ArrayList<>();
		}
		return new ResponseEntity<>(layers, HttpStatus.OK);
	}
}
