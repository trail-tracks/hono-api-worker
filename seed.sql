DELETE FROM attachments;
DELETE FROM points_of_interest;
DELETE FROM trails;
DELETE FROM entities;
DELETE FROM sqlite_sequence WHERE name IN ('entities', 'trails', 'points_of_interest', 'attachments');

      INSERT INTO entities (id, name, email, password, zip_code, address, number, city, state, phone)
      VALUES (
        1, 
        'Entidade Teste 1', 
        'entidade1@teste.com', 
        '$2b$10$8LaUB/bnZNaKPnEiOAZsIev5esgVnN5buJefXd6LtO7oH/8WAasve', 
        '12345-678', 'Rua das Flores', '100', 'São Paulo', 'SP', '11999999999'
      );
    

      INSERT INTO attachments (uuid, bucket, object_key, mime_type, size, url, entity_id) 
      VALUES (
        '1cc820ae-584f-4899-b878-8abd15cac8ea',
        'trilha-interativa',
        'entities/1-1764029989019-entity.png',
        'image/png',
        24833,
        'https://pub-2653dd2ff24e48eebd1c76e727cb07b0.r2.dev/entities/1-1764029989019-entity.png',
        1
      );
    

        INSERT INTO trails (id, name, short_description, duration, distance, difficulty, entity_id)
        VALUES (
          1, 
          'Trilha 1 da Entidade 1', 
          'Uma trilha muito legal com belas vistas.', 
          '2h 30m', '5.5km', 'Média', 1
        );
      

        INSERT INTO attachments (uuid, bucket, object_key, mime_type, size, url, trail_id) 
        VALUES (
          '15a6d4c2-1caf-4304-b911-63d5b70f0aba',
          'trilha-interativa',
          'trails/cover/1-1764029989695-trail.png',
          'image/png',
          5275,
          'https://pub-2653dd2ff24e48eebd1c76e727cb07b0.r2.dev/trails/cover/1-1764029989695-trail.png',
          1
        );
      

          INSERT INTO points_of_interest (id, name, description, short_description, trail_id)
          VALUES (
            1, 
            'Ponto 1 da Trilha 1', 
            'Um ponto interessante para tirar fotos.', 
            'Um ponto interessante para tirar fotos.', 
            1
          );
        

          INSERT INTO attachments (uuid, bucket, object_key, mime_type, size, url, point_of_interest_id) 
          VALUES (
            '44e5f5f5-ab2d-4ac9-bf36-453b44156024',
            'trilha-interativa',
            'pois/1-1764029990243-poi.png',
            'image/png',
            6363,
            'https://pub-2653dd2ff24e48eebd1c76e727cb07b0.r2.dev/pois/1-1764029990243-poi.png',
            1
          );
        

          INSERT INTO points_of_interest (id, name, description, short_description, trail_id)
          VALUES (
            2, 
            'Ponto 2 da Trilha 1', 
            'Um ponto interessante para tirar fotos.', 
            'Um ponto interessante para tirar fotos.', 
            1
          );
        

          INSERT INTO attachments (uuid, bucket, object_key, mime_type, size, url, point_of_interest_id) 
          VALUES (
            '91a0e20e-8bb0-4006-956d-04de4f408588',
            'trilha-interativa',
            'pois/2-1764029990758-poi.png',
            'image/png',
            6363,
            'https://pub-2653dd2ff24e48eebd1c76e727cb07b0.r2.dev/pois/2-1764029990758-poi.png',
            2
          );
        

        INSERT INTO trails (id, name, short_description, duration, distance, difficulty, entity_id)
        VALUES (
          2, 
          'Trilha 2 da Entidade 1', 
          'Uma trilha muito legal com belas vistas.', 
          '2h 30m', '5.5km', 'Média', 1
        );
      

        INSERT INTO attachments (uuid, bucket, object_key, mime_type, size, url, trail_id) 
        VALUES (
          'a81e3611-cb1b-46e6-aeba-06d905c8b9fe',
          'trilha-interativa',
          'trails/cover/2-1764029991313-trail.png',
          'image/png',
          5275,
          'https://pub-2653dd2ff24e48eebd1c76e727cb07b0.r2.dev/trails/cover/2-1764029991313-trail.png',
          2
        );
      

          INSERT INTO points_of_interest (id, name, description, short_description, trail_id)
          VALUES (
            3, 
            'Ponto 1 da Trilha 2', 
            'Um ponto interessante para tirar fotos.', 
            'Um ponto interessante para tirar fotos.', 
            2
          );
        

          INSERT INTO attachments (uuid, bucket, object_key, mime_type, size, url, point_of_interest_id) 
          VALUES (
            '50cd0c05-b4b3-47f2-89bd-3810a6a79ec8',
            'trilha-interativa',
            'pois/3-1764029991845-poi.png',
            'image/png',
            6363,
            'https://pub-2653dd2ff24e48eebd1c76e727cb07b0.r2.dev/pois/3-1764029991845-poi.png',
            3
          );
        

          INSERT INTO points_of_interest (id, name, description, short_description, trail_id)
          VALUES (
            4, 
            'Ponto 2 da Trilha 2', 
            'Um ponto interessante para tirar fotos.', 
            'Um ponto interessante para tirar fotos.', 
            2
          );
        

          INSERT INTO attachments (uuid, bucket, object_key, mime_type, size, url, point_of_interest_id) 
          VALUES (
            '026d65c1-a4b1-46e8-acde-06546d46cf4e',
            'trilha-interativa',
            'pois/4-1764029992404-poi.png',
            'image/png',
            6363,
            'https://pub-2653dd2ff24e48eebd1c76e727cb07b0.r2.dev/pois/4-1764029992404-poi.png',
            4
          );
        

        INSERT INTO trails (id, name, short_description, duration, distance, difficulty, entity_id)
        VALUES (
          3, 
          'Trilha 3 da Entidade 1', 
          'Uma trilha muito legal com belas vistas.', 
          '2h 30m', '5.5km', 'Média', 1
        );
      

        INSERT INTO attachments (uuid, bucket, object_key, mime_type, size, url, trail_id) 
        VALUES (
          '72cf9489-d8b6-49b9-8c45-614d42c130c3',
          'trilha-interativa',
          'trails/cover/3-1764029992915-trail.png',
          'image/png',
          5275,
          'https://pub-2653dd2ff24e48eebd1c76e727cb07b0.r2.dev/trails/cover/3-1764029992915-trail.png',
          3
        );
      

          INSERT INTO points_of_interest (id, name, description, short_description, trail_id)
          VALUES (
            5, 
            'Ponto 1 da Trilha 3', 
            'Um ponto interessante para tirar fotos.', 
            'Um ponto interessante para tirar fotos.', 
            3
          );
        

          INSERT INTO attachments (uuid, bucket, object_key, mime_type, size, url, point_of_interest_id) 
          VALUES (
            '68f1a321-cf9a-4d06-8fd8-c3c8c3ce6865',
            'trilha-interativa',
            'pois/5-1764029993465-poi.png',
            'image/png',
            6363,
            'https://pub-2653dd2ff24e48eebd1c76e727cb07b0.r2.dev/pois/5-1764029993465-poi.png',
            5
          );
        

          INSERT INTO points_of_interest (id, name, description, short_description, trail_id)
          VALUES (
            6, 
            'Ponto 2 da Trilha 3', 
            'Um ponto interessante para tirar fotos.', 
            'Um ponto interessante para tirar fotos.', 
            3
          );
        

          INSERT INTO attachments (uuid, bucket, object_key, mime_type, size, url, point_of_interest_id) 
          VALUES (
            '2eaa9c32-0ccb-4a10-993f-772da101f2bb',
            'trilha-interativa',
            'pois/6-1764029994011-poi.png',
            'image/png',
            6363,
            'https://pub-2653dd2ff24e48eebd1c76e727cb07b0.r2.dev/pois/6-1764029994011-poi.png',
            6
          );
        

      INSERT INTO entities (id, name, email, password, zip_code, address, number, city, state, phone)
      VALUES (
        2, 
        'Entidade Teste 2', 
        'entidade2@teste.com', 
        '$2b$10$WtiIueta2BDlde/aQB41reQALY0Td3IVWh2C3uWrUefh6aGU5ldZy', 
        '12345-678', 'Rua das Flores', '100', 'São Paulo', 'SP', '11999999999'
      );
    

      INSERT INTO attachments (uuid, bucket, object_key, mime_type, size, url, entity_id) 
      VALUES (
        'e0da4c2c-53b7-4327-a0bd-32e9e3023e03',
        'trilha-interativa',
        'entities/2-1764029995198-entity.png',
        'image/png',
        24833,
        'https://pub-2653dd2ff24e48eebd1c76e727cb07b0.r2.dev/entities/2-1764029995198-entity.png',
        2
      );
    

        INSERT INTO trails (id, name, short_description, duration, distance, difficulty, entity_id)
        VALUES (
          4, 
          'Trilha 1 da Entidade 2', 
          'Uma trilha muito legal com belas vistas.', 
          '2h 30m', '5.5km', 'Média', 2
        );
      

        INSERT INTO attachments (uuid, bucket, object_key, mime_type, size, url, trail_id) 
        VALUES (
          '25d99351-a489-4ffa-814c-e500f5b3fa97',
          'trilha-interativa',
          'trails/cover/4-1764029995731-trail.png',
          'image/png',
          5275,
          'https://pub-2653dd2ff24e48eebd1c76e727cb07b0.r2.dev/trails/cover/4-1764029995731-trail.png',
          4
        );
      

          INSERT INTO points_of_interest (id, name, description, short_description, trail_id)
          VALUES (
            7, 
            'Ponto 1 da Trilha 1', 
            'Um ponto interessante para tirar fotos.', 
            'Um ponto interessante para tirar fotos.', 
            4
          );
        

          INSERT INTO attachments (uuid, bucket, object_key, mime_type, size, url, point_of_interest_id) 
          VALUES (
            '74562051-7f1a-499f-8903-7ea640449c2b',
            'trilha-interativa',
            'pois/7-1764029996589-poi.png',
            'image/png',
            6363,
            'https://pub-2653dd2ff24e48eebd1c76e727cb07b0.r2.dev/pois/7-1764029996589-poi.png',
            7
          );
        

          INSERT INTO points_of_interest (id, name, description, short_description, trail_id)
          VALUES (
            8, 
            'Ponto 2 da Trilha 1', 
            'Um ponto interessante para tirar fotos.', 
            'Um ponto interessante para tirar fotos.', 
            4
          );
        

          INSERT INTO attachments (uuid, bucket, object_key, mime_type, size, url, point_of_interest_id) 
          VALUES (
            '6bd80360-9230-4921-a616-b59c30778f92',
            'trilha-interativa',
            'pois/8-1764030069924-poi.png',
            'image/png',
            6363,
            'https://pub-2653dd2ff24e48eebd1c76e727cb07b0.r2.dev/pois/8-1764030069924-poi.png',
            8
          );
        

        INSERT INTO trails (id, name, short_description, duration, distance, difficulty, entity_id)
        VALUES (
          5, 
          'Trilha 2 da Entidade 2', 
          'Uma trilha muito legal com belas vistas.', 
          '2h 30m', '5.5km', 'Média', 2
        );
      

        INSERT INTO attachments (uuid, bucket, object_key, mime_type, size, url, trail_id) 
        VALUES (
          '1a415e0a-ffd3-4bbd-98ae-d1c555238e61',
          'trilha-interativa',
          'trails/cover/5-1764030070481-trail.png',
          'image/png',
          5275,
          'https://pub-2653dd2ff24e48eebd1c76e727cb07b0.r2.dev/trails/cover/5-1764030070481-trail.png',
          5
        );
      

          INSERT INTO points_of_interest (id, name, description, short_description, trail_id)
          VALUES (
            9, 
            'Ponto 1 da Trilha 2', 
            'Um ponto interessante para tirar fotos.', 
            'Um ponto interessante para tirar fotos.', 
            5
          );
        

          INSERT INTO attachments (uuid, bucket, object_key, mime_type, size, url, point_of_interest_id) 
          VALUES (
            'e46064b9-e521-4cca-83c6-f2b4f031bca4',
            'trilha-interativa',
            'pois/9-1764030071047-poi.png',
            'image/png',
            6363,
            'https://pub-2653dd2ff24e48eebd1c76e727cb07b0.r2.dev/pois/9-1764030071047-poi.png',
            9
          );
        

          INSERT INTO points_of_interest (id, name, description, short_description, trail_id)
          VALUES (
            10, 
            'Ponto 2 da Trilha 2', 
            'Um ponto interessante para tirar fotos.', 
            'Um ponto interessante para tirar fotos.', 
            5
          );
        

          INSERT INTO attachments (uuid, bucket, object_key, mime_type, size, url, point_of_interest_id) 
          VALUES (
            'cbd8d5fb-34c2-475c-865f-65e75d574d7c',
            'trilha-interativa',
            'pois/10-1764030071739-poi.png',
            'image/png',
            6363,
            'https://pub-2653dd2ff24e48eebd1c76e727cb07b0.r2.dev/pois/10-1764030071739-poi.png',
            10
          );
        

        INSERT INTO trails (id, name, short_description, duration, distance, difficulty, entity_id)
        VALUES (
          6, 
          'Trilha 3 da Entidade 2', 
          'Uma trilha muito legal com belas vistas.', 
          '2h 30m', '5.5km', 'Média', 2
        );
      

        INSERT INTO attachments (uuid, bucket, object_key, mime_type, size, url, trail_id) 
        VALUES (
          '249ce559-988d-4482-8712-15e8964df033',
          'trilha-interativa',
          'trails/cover/6-1764030072338-trail.png',
          'image/png',
          5275,
          'https://pub-2653dd2ff24e48eebd1c76e727cb07b0.r2.dev/trails/cover/6-1764030072338-trail.png',
          6
        );
      

          INSERT INTO points_of_interest (id, name, description, short_description, trail_id)
          VALUES (
            11, 
            'Ponto 1 da Trilha 3', 
            'Um ponto interessante para tirar fotos.', 
            'Um ponto interessante para tirar fotos.', 
            6
          );
        

          INSERT INTO attachments (uuid, bucket, object_key, mime_type, size, url, point_of_interest_id) 
          VALUES (
            '9c2cd37a-57b3-4198-b358-41f56506e649',
            'trilha-interativa',
            'pois/11-1764030072954-poi.png',
            'image/png',
            6363,
            'https://pub-2653dd2ff24e48eebd1c76e727cb07b0.r2.dev/pois/11-1764030072954-poi.png',
            11
          );
        

          INSERT INTO points_of_interest (id, name, description, short_description, trail_id)
          VALUES (
            12, 
            'Ponto 2 da Trilha 3', 
            'Um ponto interessante para tirar fotos.', 
            'Um ponto interessante para tirar fotos.', 
            6
          );
        

          INSERT INTO attachments (uuid, bucket, object_key, mime_type, size, url, point_of_interest_id) 
          VALUES (
            'e898028e-5654-470a-8f40-ca3f7de72377',
            'trilha-interativa',
            'pois/12-1764030074074-poi.png',
            'image/png',
            6363,
            'https://pub-2653dd2ff24e48eebd1c76e727cb07b0.r2.dev/pois/12-1764030074074-poi.png',
            12
          );
        

      INSERT INTO entities (id, name, email, password, zip_code, address, number, city, state, phone)
      VALUES (
        3, 
        'Entidade Teste 3', 
        'entidade3@teste.com', 
        '$2b$10$iW1adNUEnJNsW7KbqdLKmu.vIRdVhLYXwubwzK4PGPlPK2CUdx8xm', 
        '12345-678', 'Rua das Flores', '100', 'São Paulo', 'SP', '11999999999'
      );
    

      INSERT INTO attachments (uuid, bucket, object_key, mime_type, size, url, entity_id) 
      VALUES (
        'ec446b2c-7541-4839-9a4d-491b8f9449f5',
        'trilha-interativa',
        'entities/3-1764030074653-entity.png',
        'image/png',
        24833,
        'https://pub-2653dd2ff24e48eebd1c76e727cb07b0.r2.dev/entities/3-1764030074653-entity.png',
        3
      );
    

        INSERT INTO trails (id, name, short_description, duration, distance, difficulty, entity_id)
        VALUES (
          7, 
          'Trilha 1 da Entidade 3', 
          'Uma trilha muito legal com belas vistas.', 
          '2h 30m', '5.5km', 'Média', 3
        );
      

        INSERT INTO attachments (uuid, bucket, object_key, mime_type, size, url, trail_id) 
        VALUES (
          '099478cf-083e-4e0f-81a7-2ce2920599d9',
          'trilha-interativa',
          'trails/cover/7-1764030075204-trail.png',
          'image/png',
          5275,
          'https://pub-2653dd2ff24e48eebd1c76e727cb07b0.r2.dev/trails/cover/7-1764030075204-trail.png',
          7
        );
      

          INSERT INTO points_of_interest (id, name, description, short_description, trail_id)
          VALUES (
            13, 
            'Ponto 1 da Trilha 1', 
            'Um ponto interessante para tirar fotos.', 
            'Um ponto interessante para tirar fotos.', 
            7
          );
        

          INSERT INTO attachments (uuid, bucket, object_key, mime_type, size, url, point_of_interest_id) 
          VALUES (
            'b35b557b-b2f6-4e36-966b-4d224eaf4a4f',
            'trilha-interativa',
            'pois/13-1764030075752-poi.png',
            'image/png',
            6363,
            'https://pub-2653dd2ff24e48eebd1c76e727cb07b0.r2.dev/pois/13-1764030075752-poi.png',
            13
          );
        

          INSERT INTO points_of_interest (id, name, description, short_description, trail_id)
          VALUES (
            14, 
            'Ponto 2 da Trilha 1', 
            'Um ponto interessante para tirar fotos.', 
            'Um ponto interessante para tirar fotos.', 
            7
          );
        

          INSERT INTO attachments (uuid, bucket, object_key, mime_type, size, url, point_of_interest_id) 
          VALUES (
            'ee043089-26be-4b2c-8fc5-dbb21eb3ce3a',
            'trilha-interativa',
            'pois/14-1764030076278-poi.png',
            'image/png',
            6363,
            'https://pub-2653dd2ff24e48eebd1c76e727cb07b0.r2.dev/pois/14-1764030076278-poi.png',
            14
          );
        

        INSERT INTO trails (id, name, short_description, duration, distance, difficulty, entity_id)
        VALUES (
          8, 
          'Trilha 2 da Entidade 3', 
          'Uma trilha muito legal com belas vistas.', 
          '2h 30m', '5.5km', 'Média', 3
        );
      

        INSERT INTO attachments (uuid, bucket, object_key, mime_type, size, url, trail_id) 
        VALUES (
          '87b8d56a-ca98-4e40-a46f-b12d04247372',
          'trilha-interativa',
          'trails/cover/8-1764030076820-trail.png',
          'image/png',
          5275,
          'https://pub-2653dd2ff24e48eebd1c76e727cb07b0.r2.dev/trails/cover/8-1764030076820-trail.png',
          8
        );
      

          INSERT INTO points_of_interest (id, name, description, short_description, trail_id)
          VALUES (
            15, 
            'Ponto 1 da Trilha 2', 
            'Um ponto interessante para tirar fotos.', 
            'Um ponto interessante para tirar fotos.', 
            8
          );
        

          INSERT INTO attachments (uuid, bucket, object_key, mime_type, size, url, point_of_interest_id) 
          VALUES (
            'fda7ab37-d73e-4949-964b-0186929e76f4',
            'trilha-interativa',
            'pois/15-1764030077350-poi.png',
            'image/png',
            6363,
            'https://pub-2653dd2ff24e48eebd1c76e727cb07b0.r2.dev/pois/15-1764030077350-poi.png',
            15
          );
        

          INSERT INTO points_of_interest (id, name, description, short_description, trail_id)
          VALUES (
            16, 
            'Ponto 2 da Trilha 2', 
            'Um ponto interessante para tirar fotos.', 
            'Um ponto interessante para tirar fotos.', 
            8
          );
        

          INSERT INTO attachments (uuid, bucket, object_key, mime_type, size, url, point_of_interest_id) 
          VALUES (
            '52a0d10c-9560-4591-8d8a-73c8413b2145',
            'trilha-interativa',
            'pois/16-1764030077869-poi.png',
            'image/png',
            6363,
            'https://pub-2653dd2ff24e48eebd1c76e727cb07b0.r2.dev/pois/16-1764030077869-poi.png',
            16
          );
        

        INSERT INTO trails (id, name, short_description, duration, distance, difficulty, entity_id)
        VALUES (
          9, 
          'Trilha 3 da Entidade 3', 
          'Uma trilha muito legal com belas vistas.', 
          '2h 30m', '5.5km', 'Média', 3
        );
      

        INSERT INTO attachments (uuid, bucket, object_key, mime_type, size, url, trail_id) 
        VALUES (
          '22381876-7f6d-4fc4-88fe-4dcd3841f2db',
          'trilha-interativa',
          'trails/cover/9-1764030079861-trail.png',
          'image/png',
          5275,
          'https://pub-2653dd2ff24e48eebd1c76e727cb07b0.r2.dev/trails/cover/9-1764030079861-trail.png',
          9
        );
      

          INSERT INTO points_of_interest (id, name, description, short_description, trail_id)
          VALUES (
            17, 
            'Ponto 1 da Trilha 3', 
            'Um ponto interessante para tirar fotos.', 
            'Um ponto interessante para tirar fotos.', 
            9
          );
        

          INSERT INTO attachments (uuid, bucket, object_key, mime_type, size, url, point_of_interest_id) 
          VALUES (
            'c5a69494-a63f-4a4c-8312-cd8a1f560d37',
            'trilha-interativa',
            'pois/17-1764030080370-poi.png',
            'image/png',
            6363,
            'https://pub-2653dd2ff24e48eebd1c76e727cb07b0.r2.dev/pois/17-1764030080370-poi.png',
            17
          );
        

          INSERT INTO points_of_interest (id, name, description, short_description, trail_id)
          VALUES (
            18, 
            'Ponto 2 da Trilha 3', 
            'Um ponto interessante para tirar fotos.', 
            'Um ponto interessante para tirar fotos.', 
            9
          );
        

          INSERT INTO attachments (uuid, bucket, object_key, mime_type, size, url, point_of_interest_id) 
          VALUES (
            '09e887dc-1551-4973-be6a-d99b1e0c75d6',
            'trilha-interativa',
            'pois/18-1764030080879-poi.png',
            'image/png',
            6363,
            'https://pub-2653dd2ff24e48eebd1c76e727cb07b0.r2.dev/pois/18-1764030080879-poi.png',
            18
          );
        