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
        '$2b$10$f/N5oQ5.SADFfSdzxn2gRuhx5FfSwbF0.8jce34pgxH.WxEKeBmuu', 
        '12345-678', 'Rua das Flores', '100', 'São Paulo', 'SP', '11999999999'
      );
    

      INSERT INTO attachments (uuid, bucket, object_key, mime_type, size, url, entity_id) 
      VALUES (
        '327f930a-8a05-44aa-8268-297bcc67badb',
        'trilha-interativa',
        'entities/1-1764026946304-entity.png',
        'image/png',
        24833,
        'https://pub-68987b295c01328af6baa1761e79f5a9.r2.dev/entities/1-1764026946304-entity.png',
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
          '6a3137cb-4b87-4d62-a699-defa2f1da15c',
          'trilha-interativa',
          'trails/cover/1-1764026946960-trail.png',
          'image/png',
          5275,
          'https://pub-68987b295c01328af6baa1761e79f5a9.r2.dev/trails/cover/1-1764026946960-trail.png',
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
            '2afcda91-844e-4945-b7b0-3799b2253e41',
            'trilha-interativa',
            'pois/1-1764026947495-poi.png',
            'image/png',
            6363,
            'https://pub-68987b295c01328af6baa1761e79f5a9.r2.dev/pois/1-1764026947495-poi.png',
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
            '36ab60a0-55f3-4da8-8fdd-9fc5c38f59d7',
            'trilha-interativa',
            'pois/2-1764026948032-poi.png',
            'image/png',
            6363,
            'https://pub-68987b295c01328af6baa1761e79f5a9.r2.dev/pois/2-1764026948032-poi.png',
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
          'bd9ab735-86bb-4f40-b7b1-bd5bb061dfee',
          'trilha-interativa',
          'trails/cover/2-1764026948592-trail.png',
          'image/png',
          5275,
          'https://pub-68987b295c01328af6baa1761e79f5a9.r2.dev/trails/cover/2-1764026948592-trail.png',
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
            '758623d6-7ea9-4da5-90e4-d0945418abd0',
            'trilha-interativa',
            'pois/3-1764026949114-poi.png',
            'image/png',
            6363,
            'https://pub-68987b295c01328af6baa1761e79f5a9.r2.dev/pois/3-1764026949114-poi.png',
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
            '7a7022f3-e622-409b-8642-152a0d0125ab',
            'trilha-interativa',
            'pois/4-1764026949767-poi.png',
            'image/png',
            6363,
            'https://pub-68987b295c01328af6baa1761e79f5a9.r2.dev/pois/4-1764026949767-poi.png',
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
          '3ff8c8a5-29bd-4d6f-81f4-b5109ba8de1c',
          'trilha-interativa',
          'trails/cover/3-1764026950307-trail.png',
          'image/png',
          5275,
          'https://pub-68987b295c01328af6baa1761e79f5a9.r2.dev/trails/cover/3-1764026950307-trail.png',
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
            'd689c472-b0b1-4104-9b1a-d023eb08de1f',
            'trilha-interativa',
            'pois/5-1764026950895-poi.png',
            'image/png',
            6363,
            'https://pub-68987b295c01328af6baa1761e79f5a9.r2.dev/pois/5-1764026950895-poi.png',
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
            '128c6ae4-16c4-4a27-8868-9407663a5f68',
            'trilha-interativa',
            'pois/6-1764026951442-poi.png',
            'image/png',
            6363,
            'https://pub-68987b295c01328af6baa1761e79f5a9.r2.dev/pois/6-1764026951442-poi.png',
            6
          );
        

      INSERT INTO entities (id, name, email, password, zip_code, address, number, city, state, phone)
      VALUES (
        2, 
        'Entidade Teste 2', 
        'entidade2@teste.com', 
        '$2b$10$SXLCzjyfoLQtTUtAwDD1JuQMAFM88/FiH9tjqO.k88LZTeEaTo4z2', 
        '12345-678', 'Rua das Flores', '100', 'São Paulo', 'SP', '11999999999'
      );
    

      INSERT INTO attachments (uuid, bucket, object_key, mime_type, size, url, entity_id) 
      VALUES (
        'fda9afb1-7ff7-4932-bf51-b2b41ceb4ad3',
        'trilha-interativa',
        'entities/2-1764026952058-entity.png',
        'image/png',
        24833,
        'https://pub-68987b295c01328af6baa1761e79f5a9.r2.dev/entities/2-1764026952058-entity.png',
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
          '8703ae1c-b578-43c4-bc79-d3119845d635',
          'trilha-interativa',
          'trails/cover/4-1764026952576-trail.png',
          'image/png',
          5275,
          'https://pub-68987b295c01328af6baa1761e79f5a9.r2.dev/trails/cover/4-1764026952576-trail.png',
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
            'd79be8ff-1044-4e72-b310-8a16f497bf61',
            'trilha-interativa',
            'pois/7-1764026953120-poi.png',
            'image/png',
            6363,
            'https://pub-68987b295c01328af6baa1761e79f5a9.r2.dev/pois/7-1764026953120-poi.png',
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
            '79c8c9f7-0bb2-451b-a844-3fe0dcff5eaf',
            'trilha-interativa',
            'pois/8-1764026953660-poi.png',
            'image/png',
            6363,
            'https://pub-68987b295c01328af6baa1761e79f5a9.r2.dev/pois/8-1764026953660-poi.png',
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
          '57d5af06-0450-455e-9af2-8bfbe8307f02',
          'trilha-interativa',
          'trails/cover/5-1764026954220-trail.png',
          'image/png',
          5275,
          'https://pub-68987b295c01328af6baa1761e79f5a9.r2.dev/trails/cover/5-1764026954220-trail.png',
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
            '3492dbc6-3407-4f96-8335-b605d4c04af3',
            'trilha-interativa',
            'pois/9-1764026954735-poi.png',
            'image/png',
            6363,
            'https://pub-68987b295c01328af6baa1761e79f5a9.r2.dev/pois/9-1764026954735-poi.png',
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
            'b84a58a6-62dd-4762-88c6-0746c15bf993',
            'trilha-interativa',
            'pois/10-1764026955264-poi.png',
            'image/png',
            6363,
            'https://pub-68987b295c01328af6baa1761e79f5a9.r2.dev/pois/10-1764026955264-poi.png',
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
          '607786a5-1e16-4aa5-80b1-6be90abd0c41',
          'trilha-interativa',
          'trails/cover/6-1764026955785-trail.png',
          'image/png',
          5275,
          'https://pub-68987b295c01328af6baa1761e79f5a9.r2.dev/trails/cover/6-1764026955785-trail.png',
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
            '0445e436-f94c-4d71-aad8-5d052db33e62',
            'trilha-interativa',
            'pois/11-1764026956312-poi.png',
            'image/png',
            6363,
            'https://pub-68987b295c01328af6baa1761e79f5a9.r2.dev/pois/11-1764026956312-poi.png',
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
            'ede0b872-42c9-4381-ab73-7e40d119f0e5',
            'trilha-interativa',
            'pois/12-1764026956830-poi.png',
            'image/png',
            6363,
            'https://pub-68987b295c01328af6baa1761e79f5a9.r2.dev/pois/12-1764026956830-poi.png',
            12
          );
        

      INSERT INTO entities (id, name, email, password, zip_code, address, number, city, state, phone)
      VALUES (
        3, 
        'Entidade Teste 3', 
        'entidade3@teste.com', 
        '$2b$10$lMa7UuN95ICX9kvMq3tDBO8/wy8mpfgltoGIevUN8UWjfhUm4hC/.', 
        '12345-678', 'Rua das Flores', '100', 'São Paulo', 'SP', '11999999999'
      );
    

      INSERT INTO attachments (uuid, bucket, object_key, mime_type, size, url, entity_id) 
      VALUES (
        'd7d61802-eb23-4886-ab6d-9d68e9edcf38',
        'trilha-interativa',
        'entities/3-1764026957420-entity.png',
        'image/png',
        24833,
        'https://pub-68987b295c01328af6baa1761e79f5a9.r2.dev/entities/3-1764026957420-entity.png',
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
          '2e2a0d83-491b-4240-b3a2-2fed812979dc',
          'trilha-interativa',
          'trails/cover/7-1764026958072-trail.png',
          'image/png',
          5275,
          'https://pub-68987b295c01328af6baa1761e79f5a9.r2.dev/trails/cover/7-1764026958072-trail.png',
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
            '1c2cce9a-bc95-4d4a-9c79-b833097d9902',
            'trilha-interativa',
            'pois/13-1764026958610-poi.png',
            'image/png',
            6363,
            'https://pub-68987b295c01328af6baa1761e79f5a9.r2.dev/pois/13-1764026958610-poi.png',
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
            '3565e320-d1c7-4daa-8acc-b4d13b8e3c14',
            'trilha-interativa',
            'pois/14-1764026959125-poi.png',
            'image/png',
            6363,
            'https://pub-68987b295c01328af6baa1761e79f5a9.r2.dev/pois/14-1764026959125-poi.png',
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
          '9e3f6b61-d329-477d-8b05-b5557e32350d',
          'trilha-interativa',
          'trails/cover/8-1764026959680-trail.png',
          'image/png',
          5275,
          'https://pub-68987b295c01328af6baa1761e79f5a9.r2.dev/trails/cover/8-1764026959680-trail.png',
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
            '881b23f9-d0d8-4168-91ac-a8f12c5e65a5',
            'trilha-interativa',
            'pois/15-1764026960259-poi.png',
            'image/png',
            6363,
            'https://pub-68987b295c01328af6baa1761e79f5a9.r2.dev/pois/15-1764026960259-poi.png',
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
            'cbeac117-6310-46fb-9198-11653703bccf',
            'trilha-interativa',
            'pois/16-1764026960890-poi.png',
            'image/png',
            6363,
            'https://pub-68987b295c01328af6baa1761e79f5a9.r2.dev/pois/16-1764026960890-poi.png',
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
          '5f7f4cb4-1948-4dfa-9583-ddadd84ed45c',
          'trilha-interativa',
          'trails/cover/9-1764026961431-trail.png',
          'image/png',
          5275,
          'https://pub-68987b295c01328af6baa1761e79f5a9.r2.dev/trails/cover/9-1764026961431-trail.png',
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
            '31ba7c0a-9756-4ee7-bf8e-c6d4a21f76e7',
            'trilha-interativa',
            'pois/17-1764026962048-poi.png',
            'image/png',
            6363,
            'https://pub-68987b295c01328af6baa1761e79f5a9.r2.dev/pois/17-1764026962048-poi.png',
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
            '17c4981e-d40c-43ee-9a6b-e8ccb63348b3',
            'trilha-interativa',
            'pois/18-1764026962547-poi.png',
            'image/png',
            6363,
            'https://pub-68987b295c01328af6baa1761e79f5a9.r2.dev/pois/18-1764026962547-poi.png',
            18
          );
        