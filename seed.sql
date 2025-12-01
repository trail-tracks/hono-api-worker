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
        '$2b$10$AMCJ2zVemv0wnt.yJxygoO7ZCBBP.on5opnmMMZi4Z./5MIUyKCi.', 
        '12345-678', 'Rua das Flores', '100', 'São Paulo', 'SP', '11999999999'
      );
    

      INSERT INTO attachments (uuid, bucket, object_key, mime_type, size, url, entity_id) 
      VALUES (
        'e67ef1b0-fc37-4545-b463-bfe9b6aa10f5',
        'trilha-interativa',
        'entities/1-1764616704161-entity.png',
        'image/png',
        24833,
        'https://pub-4fd01de8364449ec9c9bcc5660666845.r2.dev/entities/1-1764616704161-entity.png',
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
          'b99978ea-9bef-493a-a6ef-63cc227099f1',
          'trilha-interativa',
          'trails/cover/1-1764616705385-trail.png',
          'image/png',
          5275,
          'https://pub-4fd01de8364449ec9c9bcc5660666845.r2.dev/trails/cover/1-1764616705385-trail.png',
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
            '2af9b517-56dd-4e04-a100-0518a1a25ddc',
            'trilha-interativa',
            'pois/1-1764616705914-poi.png',
            'image/png',
            6363,
            'https://pub-4fd01de8364449ec9c9bcc5660666845.r2.dev/pois/1-1764616705914-poi.png',
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
            'a32f784b-1734-4ed1-be74-d157358dfc25',
            'trilha-interativa',
            'pois/2-1764616706462-poi.png',
            'image/png',
            6363,
            'https://pub-4fd01de8364449ec9c9bcc5660666845.r2.dev/pois/2-1764616706462-poi.png',
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
          '6fcde4d2-f8dc-4873-9f1b-dc8123704b41',
          'trilha-interativa',
          'trails/cover/2-1764616707012-trail.png',
          'image/png',
          5275,
          'https://pub-4fd01de8364449ec9c9bcc5660666845.r2.dev/trails/cover/2-1764616707012-trail.png',
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
            '154f42f7-ed27-49b3-be5d-762d216f1a74',
            'trilha-interativa',
            'pois/3-1764616707586-poi.png',
            'image/png',
            6363,
            'https://pub-4fd01de8364449ec9c9bcc5660666845.r2.dev/pois/3-1764616707586-poi.png',
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
            '4c67bf14-b050-49b2-a882-dbc09e0eb0b9',
            'trilha-interativa',
            'pois/4-1764616708211-poi.png',
            'image/png',
            6363,
            'https://pub-4fd01de8364449ec9c9bcc5660666845.r2.dev/pois/4-1764616708211-poi.png',
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
          '98cae665-c624-4365-8b9e-2b81e2fda62b',
          'trilha-interativa',
          'trails/cover/3-1764616708785-trail.png',
          'image/png',
          5275,
          'https://pub-4fd01de8364449ec9c9bcc5660666845.r2.dev/trails/cover/3-1764616708785-trail.png',
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
            'ac93cec1-2003-4849-80b6-0a2459c9508a',
            'trilha-interativa',
            'pois/5-1764616709357-poi.png',
            'image/png',
            6363,
            'https://pub-4fd01de8364449ec9c9bcc5660666845.r2.dev/pois/5-1764616709357-poi.png',
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
            '8a683896-0d98-4310-a6fc-33c3a42f3399',
            'trilha-interativa',
            'pois/6-1764616709929-poi.png',
            'image/png',
            6363,
            'https://pub-4fd01de8364449ec9c9bcc5660666845.r2.dev/pois/6-1764616709929-poi.png',
            6
          );
        

      INSERT INTO entities (id, name, email, password, zip_code, address, number, city, state, phone)
      VALUES (
        2, 
        'Entidade Teste 2', 
        'entidade2@teste.com', 
        '$2b$10$eK0dER/1KnNN9aQ4Q0A.auJd6vR37Ti/Ds8cmxVX8dTuxFE4nSaiO', 
        '12345-678', 'Rua das Flores', '100', 'São Paulo', 'SP', '11999999999'
      );
    

      INSERT INTO attachments (uuid, bucket, object_key, mime_type, size, url, entity_id) 
      VALUES (
        'e6105526-07e4-4639-a43a-d4330091fa2f',
        'trilha-interativa',
        'entities/2-1764616710617-entity.png',
        'image/png',
        24833,
        'https://pub-4fd01de8364449ec9c9bcc5660666845.r2.dev/entities/2-1764616710617-entity.png',
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
          'eb95615d-2d8d-4f7b-8c3f-69a4cd709fee',
          'trilha-interativa',
          'trails/cover/4-1764616711250-trail.png',
          'image/png',
          5275,
          'https://pub-4fd01de8364449ec9c9bcc5660666845.r2.dev/trails/cover/4-1764616711250-trail.png',
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
            '9ff2acf6-394d-43b1-85d0-ad18667fe266',
            'trilha-interativa',
            'pois/7-1764616711817-poi.png',
            'image/png',
            6363,
            'https://pub-4fd01de8364449ec9c9bcc5660666845.r2.dev/pois/7-1764616711817-poi.png',
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
            '58a5091a-dc66-4370-91e3-f6f541caf24a',
            'trilha-interativa',
            'pois/8-1764616712348-poi.png',
            'image/png',
            6363,
            'https://pub-4fd01de8364449ec9c9bcc5660666845.r2.dev/pois/8-1764616712348-poi.png',
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
          '6807ef80-f385-4c12-b5a8-cfb0229fab34',
          'trilha-interativa',
          'trails/cover/5-1764616712921-trail.png',
          'image/png',
          5275,
          'https://pub-4fd01de8364449ec9c9bcc5660666845.r2.dev/trails/cover/5-1764616712921-trail.png',
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
            'af154118-38ea-42dd-81a9-17484e846640',
            'trilha-interativa',
            'pois/9-1764616713466-poi.png',
            'image/png',
            6363,
            'https://pub-4fd01de8364449ec9c9bcc5660666845.r2.dev/pois/9-1764616713466-poi.png',
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
            'c988af58-c449-4e57-9471-fc70499b892d',
            'trilha-interativa',
            'pois/10-1764616714021-poi.png',
            'image/png',
            6363,
            'https://pub-4fd01de8364449ec9c9bcc5660666845.r2.dev/pois/10-1764616714021-poi.png',
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
          'de826983-75a1-4b97-b444-8457ae0f5821',
          'trilha-interativa',
          'trails/cover/6-1764616714568-trail.png',
          'image/png',
          5275,
          'https://pub-4fd01de8364449ec9c9bcc5660666845.r2.dev/trails/cover/6-1764616714568-trail.png',
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
            '5368a2ac-08b0-4dd6-9ac9-509702fe28c6',
            'trilha-interativa',
            'pois/11-1764616715170-poi.png',
            'image/png',
            6363,
            'https://pub-4fd01de8364449ec9c9bcc5660666845.r2.dev/pois/11-1764616715170-poi.png',
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
            'efbe5e68-3e69-4ec4-8f1a-5be8007eff03',
            'trilha-interativa',
            'pois/12-1764616715706-poi.png',
            'image/png',
            6363,
            'https://pub-4fd01de8364449ec9c9bcc5660666845.r2.dev/pois/12-1764616715706-poi.png',
            12
          );
        

      INSERT INTO entities (id, name, email, password, zip_code, address, number, city, state, phone)
      VALUES (
        3, 
        'Entidade Teste 3', 
        'entidade3@teste.com', 
        '$2b$10$I6lOFySCcNwM8dAafAWSWuGSXaCPjc7YHpjH84USNGCMWOZS5mfG6', 
        '12345-678', 'Rua das Flores', '100', 'São Paulo', 'SP', '11999999999'
      );
    

      INSERT INTO attachments (uuid, bucket, object_key, mime_type, size, url, entity_id) 
      VALUES (
        '10e7cf90-825f-48d5-9869-128833ac081e',
        'trilha-interativa',
        'entities/3-1764616716373-entity.png',
        'image/png',
        24833,
        'https://pub-4fd01de8364449ec9c9bcc5660666845.r2.dev/entities/3-1764616716373-entity.png',
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
          '8a392d71-0342-47c3-9171-311697280523',
          'trilha-interativa',
          'trails/cover/7-1764616716960-trail.png',
          'image/png',
          5275,
          'https://pub-4fd01de8364449ec9c9bcc5660666845.r2.dev/trails/cover/7-1764616716960-trail.png',
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
            '90124291-9d05-4dbc-8af3-2eb5ae07d679',
            'trilha-interativa',
            'pois/13-1764616717527-poi.png',
            'image/png',
            6363,
            'https://pub-4fd01de8364449ec9c9bcc5660666845.r2.dev/pois/13-1764616717527-poi.png',
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
            '4c17a5e1-254f-4f5d-a6c0-6254ee5f55a4',
            'trilha-interativa',
            'pois/14-1764616718079-poi.png',
            'image/png',
            6363,
            'https://pub-4fd01de8364449ec9c9bcc5660666845.r2.dev/pois/14-1764616718079-poi.png',
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
          '6dbbbf6e-bc35-4e06-8120-2372a25f743d',
          'trilha-interativa',
          'trails/cover/8-1764616718627-trail.png',
          'image/png',
          5275,
          'https://pub-4fd01de8364449ec9c9bcc5660666845.r2.dev/trails/cover/8-1764616718627-trail.png',
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
            '0bba7e78-326e-41a7-80d0-d3e0a25e637f',
            'trilha-interativa',
            'pois/15-1764616719188-poi.png',
            'image/png',
            6363,
            'https://pub-4fd01de8364449ec9c9bcc5660666845.r2.dev/pois/15-1764616719188-poi.png',
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
            '61ed418b-35ab-4cb1-ba4a-9f9fd7c26da7',
            'trilha-interativa',
            'pois/16-1764616719725-poi.png',
            'image/png',
            6363,
            'https://pub-4fd01de8364449ec9c9bcc5660666845.r2.dev/pois/16-1764616719725-poi.png',
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
          'fabf056e-84b8-4117-8a78-3625d2db6f24',
          'trilha-interativa',
          'trails/cover/9-1764616720276-trail.png',
          'image/png',
          5275,
          'https://pub-4fd01de8364449ec9c9bcc5660666845.r2.dev/trails/cover/9-1764616720276-trail.png',
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
            'cac9888f-de22-4a73-b0ad-96041a5c0895',
            'trilha-interativa',
            'pois/17-1764616720880-poi.png',
            'image/png',
            6363,
            'https://pub-4fd01de8364449ec9c9bcc5660666845.r2.dev/pois/17-1764616720880-poi.png',
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
            'e6a3e1d1-c979-4e6c-bc6b-2947a8219365',
            'trilha-interativa',
            'pois/18-1764616721530-poi.png',
            'image/png',
            6363,
            'https://pub-4fd01de8364449ec9c9bcc5660666845.r2.dev/pois/18-1764616721530-poi.png',
            18
          );
        