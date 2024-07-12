package net.estg.ei.backend;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import java.util.Date;

import com.github.springtestdbunit.DbUnitTestExecutionListener;
import com.github.springtestdbunit.annotation.DatabaseSetup;
import jakarta.ws.rs.core.Application;
import net.estg.ei.backend.dto.FilterDTO;
import net.estg.ei.backend.dto.GeoLocationDTO;
import net.estg.ei.backend.entity.PredictionEntity;
import net.estg.ei.backend.enums.AttackType;
import net.estg.ei.backend.service.IPredictionService;
import net.estg.ei.backend.service.PredictionsServiceImpl;
import org.antlr.v4.runtime.misc.Pair;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.TestExecutionListeners;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.bind.annotation.ModelAttribute;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RunWith(SpringRunner.class)
@SpringBootTest(
				webEnvironment = SpringBootTest.WebEnvironment.MOCK,
				classes = BackendApplication.class)
@AutoConfigureMockMvc
@TestPropertySource(locations = "classpath:application-test.properties")
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
class BackendApplicationTests
{

	@Autowired
	private IPredictionService predictionService;

	@Test
	void testFindPredictionById()
	{
		PredictionEntity prediction = new PredictionEntity();
		prediction.setSourceIp("12345");
		prediction.setDestinationIp("54321");
		prediction.setProtocol("TCP");
		prediction.setAttack(false);
		prediction.setAttackType(AttackType.UNKNOWN);

		predictionService.save(prediction);

		PredictionEntity predictionEntity = predictionService.findById(1L);
		Assertions.assertEquals(predictionEntity.getId(), 1);

		Assertions.assertEquals(predictionEntity.getSourceIp(), "12345");
		Assertions.assertEquals(predictionEntity.getDestinationIp(), "54321");
		Assertions.assertEquals(predictionEntity.getProtocol(), "TCP");
		Assertions.assertFalse(predictionEntity.isAttack());
		Assertions.assertEquals(predictionEntity.getAttackType(), AttackType.UNKNOWN);
	}

	@Test
	void testFindAllPredictions()
	{
		PredictionEntity prediction = new PredictionEntity();
		prediction.setSourceIp("12345");
		prediction.setDestinationIp("54321");
		prediction.setProtocol("TCP");
		prediction.setAttack(false);
		prediction.setAttackType(AttackType.UNKNOWN);
		predictionService.save(prediction);

		PredictionEntity prediction2 = new PredictionEntity();
		prediction.setSourceIp("223333");
		prediction.setDestinationIp("2222333");
		prediction.setProtocol("UDP");
		prediction.setAttack(true);
		prediction.setAttackType(AttackType.RUDY);
		predictionService.save(prediction2);

		PredictionEntity prediction3 = new PredictionEntity();
		prediction.setSourceIp("55555");
		prediction.setDestinationIp("4444");
		prediction.setProtocol("UDP");
		prediction.setAttack(true);
		prediction.setAttackType(AttackType.SLOW_LORIS);
		predictionService.save(prediction3);

		List<PredictionEntity> list = predictionService.findAll().stream().toList();
		Assertions.assertEquals(3, list.size());
	}

	@Test
	void testCreatePrediction()
	{
		PredictionEntity prediction = new PredictionEntity();
		prediction.setSourceIp("12345");
		prediction.setDestinationIp("54321");
		prediction.setProtocol("TCP");
		prediction.setAttack(false);
		prediction.setAttackType(AttackType.UNKNOWN);

		predictionService.save(prediction);
		PredictionEntity predictionEntity = predictionService.findAll().stream().findFirst().orElse(null);
		Assertions.assertEquals(predictionEntity.getId(), 1);

		Assertions.assertEquals(predictionEntity.getSourceIp(), "12345");
		Assertions.assertEquals(predictionEntity.getDestinationIp(), "54321");
		Assertions.assertEquals(predictionEntity.getProtocol(), "TCP");
		Assertions.assertFalse(predictionEntity.isAttack());
		Assertions.assertEquals(predictionEntity.getAttackType(), AttackType.UNKNOWN);
	}

	@Test
	void testUpdatePrediction()
	{
		PredictionEntity prediction = new PredictionEntity();
		prediction.setSourceIp("12345");
		prediction.setDestinationIp("54321");
		prediction.setProtocol("TCP");
		prediction.setAttack(false);
		prediction.setAttackType(AttackType.UNKNOWN);

		predictionService.save(prediction);
		PredictionEntity predictionEntity = predictionService.findAll().stream().findFirst().orElse(null);
		Assertions.assertEquals(predictionEntity.getSourceIp(), "12345");

		predictionEntity.setSourceIp("9999999");
		assertNotNull(predictionEntity);
		predictionService.update(predictionEntity);

		PredictionEntity predictionEntityPostUpdate = predictionService.findAll().stream().findFirst().orElse(null);
		Assertions.assertEquals(predictionEntityPostUpdate.getSourceIp(), "9999999");
	}

	@Test
	void testDeletePrediction()
	{
		PredictionEntity prediction = new PredictionEntity();
		prediction.setSourceIp("12345");
		prediction.setDestinationIp("54321");
		prediction.setProtocol("TCP");
		prediction.setAttack(false);
		prediction.setAttackType(AttackType.UNKNOWN);

		predictionService.save(prediction);
		PredictionEntity predictionEntity = predictionService.findAll().stream().findFirst().orElse(null);

		assertNotNull(predictionEntity);
		predictionService.delete(predictionEntity);

		List<PredictionEntity> predictionEntityPostDelete = predictionService.findAll().stream().toList();
		Assertions.assertTrue(predictionEntityPostDelete.isEmpty());
	}
}
