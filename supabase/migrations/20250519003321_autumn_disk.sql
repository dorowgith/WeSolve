/*
  # Insert mock data

  This migration inserts mock data into the database while handling existing records:
  
  1. Users
  2. Projects
  3. Project Members
  4. Tasks
  5. Comments
  6. Attachments
  7. Activities

  The migration uses DO blocks to safely insert data and handle existing records.
*/

-- Insert mock users if they don't exist
DO $$
DECLARE
  user_data json[] := array[
    '{"id": "d7f33635-c9f3-4a6a-8f40-a51e45e4f0fb", "name": "John Doe", "email": "john@example.com", "avatar": "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"}',
    '{"id": "c5d6f755-8a3d-4a6c-9b6e-3f5d7e9c8d2a", "name": "Jane Smith", "email": "jane@example.com", "avatar": "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"}',
    '{"id": "b4e5f645-7a2d-4a6b-8c6d-2f5e7d9c8b2a", "name": "Bob Johnson", "email": "bob@example.com", "avatar": "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"}',
    '{"id": "a3d4e535-6a1d-4a6a-7b6c-1f5d7e9c7b2a", "name": "Alice Williams", "email": "alice@example.com", "avatar": "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"}'
  ];
  user_record json;
BEGIN
  FOREACH user_record IN ARRAY user_data
  LOOP
    INSERT INTO users (id, name, email, avatar_url, created_at, updated_at)
    VALUES (
      (user_record->>'id')::uuid,
      user_record->>'name',
      user_record->>'email',
      user_record->>'avatar',
      now(),
      now()
    )
    ON CONFLICT (id) DO NOTHING;
  END LOOP;
END $$;

-- Insert mock projects if they don't exist
DO $$
DECLARE
  project_data json[] := array[
    '{"id": "e8f9g635-h9i3-4j6k-8l40-m51n45o4p0fb", "name": "Website Redesign", "description": "Modernize the company website with a fresh look and improved functionality.", "color": "#3B82F6", "category": "Marketing"}',
    '{"id": "q9r8s755-t3u4-4v6w-9x6y-z51a45b4c0fb", "name": "Mobile App Development", "description": "Create a cross-platform mobile application for our customers.", "color": "#14B8A6", "category": "Development"}',
    '{"id": "d2e3f645-g4h5-4i6j-8k6l-m51n45o4p0fb", "name": "Q3 Marketing Campaign", "description": "Plan and execute the marketing strategy for Q3.", "color": "#F59E0B", "category": "Marketing"}',
    '{"id": "q7r8s755-t9u0-4v1w-2x3y-z51a45b4c0fb", "name": "Product Launch", "description": "Coordinate all aspects of the new product launch.", "color": "#EC4899", "category": "Product"}'
  ];
  project_record json;
BEGIN
  FOREACH project_record IN ARRAY project_data
  LOOP
    INSERT INTO projects (id, name, description, color, category, created_at, updated_at)
    VALUES (
      (project_record->>'id')::uuid,
      project_record->>'name',
      project_record->>'description',
      project_record->>'color',
      project_record->>'category',
      now() - (random() * 60 || ' days')::interval,
      now() - (random() * 7 || ' days')::interval
    )
    ON CONFLICT (id) DO NOTHING;
  END LOOP;
END $$;

-- Insert project members if they don't exist
DO $$
DECLARE
  member_data json[] := array[
    '{"project_id": "e8f9g635-h9i3-4j6k-8l40-m51n45o4p0fb", "user_id": "d7f33635-c9f3-4a6a-8f40-a51e45e4f0fb", "role": "owner"}',
    '{"project_id": "e8f9g635-h9i3-4j6k-8l40-m51n45o4p0fb", "user_id": "c5d6f755-8a3d-4a6c-9b6e-3f5d7e9c8d2a", "role": "member"}',
    '{"project_id": "e8f9g635-h9i3-4j6k-8l40-m51n45o4p0fb", "user_id": "b4e5f645-7a2d-4a6b-8c6d-2f5e7d9c8b2a", "role": "member"}',
    '{"project_id": "q9r8s755-t3u4-4v6w-9x6y-z51a45b4c0fb", "user_id": "d7f33635-c9f3-4a6a-8f40-a51e45e4f0fb", "role": "owner"}',
    '{"project_id": "q9r8s755-t3u4-4v6w-9x6y-z51a45b4c0fb", "user_id": "a3d4e535-6a1d-4a6a-7b6c-1f5d7e9c7b2a", "role": "member"}',
    '{"project_id": "d2e3f645-g4h5-4i6j-8k6l-m51n45o4p0fb", "user_id": "d7f33635-c9f3-4a6a-8f40-a51e45e4f0fb", "role": "owner"}',
    '{"project_id": "d2e3f645-g4h5-4i6j-8k6l-m51n45o4p0fb", "user_id": "c5d6f755-8a3d-4a6c-9b6e-3f5d7e9c8d2a", "role": "member"}',
    '{"project_id": "q7r8s755-t9u0-4v1w-2x3y-z51a45b4c0fb", "user_id": "d7f33635-c9f3-4a6a-8f40-a51e45e4f0fb", "role": "owner"}',
    '{"project_id": "q7r8s755-t9u0-4v1w-2x3y-z51a45b4c0fb", "user_id": "c5d6f755-8a3d-4a6c-9b6e-3f5d7e9c8d2a", "role": "member"}',
    '{"project_id": "q7r8s755-t9u0-4v1w-2x3y-z51a45b4c0fb", "user_id": "b4e5f645-7a2d-4a6b-8c6d-2f5e7d9c8b2a", "role": "member"}',
    '{"project_id": "q7r8s755-t9u0-4v1w-2x3y-z51a45b4c0fb", "user_id": "a3d4e535-6a1d-4a6a-7b6c-1f5d7e9c7b2a", "role": "member"}'
  ];
  member_record json;
BEGIN
  FOREACH member_record IN ARRAY member_data
  LOOP
    INSERT INTO project_members (project_id, user_id, role, created_at)
    VALUES (
      (member_record->>'project_id')::uuid,
      (member_record->>'user_id')::uuid,
      member_record->>'role',
      now()
    )
    ON CONFLICT (project_id, user_id) DO NOTHING;
  END LOOP;
END $$;

-- Insert tasks and related data
DO $$
DECLARE
  project_record RECORD;
  task_id uuid;
  status_array text[] := ARRAY['todo', 'in-progress', 'review', 'completed'];
  priority_array text[] := ARRAY['low', 'medium', 'high'];
  user_array uuid[] := ARRAY[
    'd7f33635-c9f3-4a6a-8f40-a51e45e4f0fb',
    'c5d6f755-8a3d-4a6c-9b6e-3f5d7e9c8d2a',
    'b4e5f645-7a2d-4a6b-8c6d-2f5e7d9c8b2a',
    'a3d4e535-6a1d-4a6a-7b6c-1f5d7e9c7b2a'
  ];
BEGIN
  FOR project_record IN SELECT * FROM projects LOOP
    -- Create 5-10 tasks for each project
    FOR i IN 1..floor(random() * 6 + 5)::int LOOP
      task_id := gen_random_uuid();
      
      -- Insert task
      INSERT INTO tasks (
        id,
        project_id,
        title,
        description,
        status,
        priority,
        due_date,
        assignee_id,
        time_spent,
        created_at,
        updated_at
      )
      VALUES (
        task_id,
        project_record.id,
        'Task ' || i || ' for ' || project_record.name,
        'This is a detailed description for task ' || i || '. It contains all the necessary information to complete this task.',
        status_array[floor(random() * array_length(status_array, 1) + 1)],
        priority_array[floor(random() * array_length(priority_array, 1) + 1)],
        now() + (random() * 14 || ' days')::interval,
        user_array[floor(random() * array_length(user_array, 1) + 1)],
        CASE WHEN random() < 0.5 THEN floor(random() * 120) ELSE NULL END,
        now() - (random() * 30 || ' days')::interval,
        now() - (random() * 7 || ' days')::interval
      )
      ON CONFLICT (id) DO NOTHING;

      -- Add comments
      IF random() < 0.7 THEN
        INSERT INTO task_comments (
          id,
          task_id,
          user_id,
          content,
          created_at
        )
        VALUES (
          gen_random_uuid(),
          task_id,
          user_array[floor(random() * array_length(user_array, 1) + 1)],
          'This is a comment on task ' || i,
          now() - (random() * 7 || ' days')::interval
        )
        ON CONFLICT (id) DO NOTHING;
      END IF;

      -- Add attachments
      IF random() < 0.3 THEN
        INSERT INTO task_attachments (
          id,
          task_id,
          name,
          url,
          type,
          size,
          uploaded_by,
          created_at
        )
        VALUES (
          gen_random_uuid(),
          task_id,
          'document-' || i || '.pdf',
          'https://example.com/files/document-' || i || '.pdf',
          'application/pdf',
          floor(random() * 1000000),
          user_array[floor(random() * array_length(user_array, 1) + 1)],
          now() - (random() * 7 || ' days')::interval
        )
        ON CONFLICT (id) DO NOTHING;
      END IF;
    END LOOP;
  END LOOP;
END $$;

-- Insert activities
DO $$
DECLARE
  project_record RECORD;
  activity_descriptions text[] := ARRAY[
    'created the project',
    'updated the project description',
    'added a new task',
    'completed task',
    'assigned task to team member',
    'updated task status to in-progress',
    'commented on task',
    'attached a file to task',
    'updated project settings',
    'added a new team member'
  ];
  user_array uuid[] := ARRAY[
    'd7f33635-c9f3-4a6a-8f40-a51e45e4f0fb',
    'c5d6f755-8a3d-4a6c-9b6e-3f5d7e9c8d2a',
    'b4e5f645-7a2d-4a6b-8c6d-2f5e7d9c8b2a',
    'a3d4e535-6a1d-4a6a-7b6c-1f5d7e9c7b2a'
  ];
BEGIN
  FOR project_record IN SELECT * FROM projects LOOP
    -- Create 5-10 activities for each project
    FOR i IN 1..floor(random() * 6 + 5)::int LOOP
      INSERT INTO activities (
        id,
        description,
        user_id,
        project_id,
        task_id,
        created_at
      )
      SELECT
        gen_random_uuid(),
        activity_descriptions[floor(random() * array_length(activity_descriptions, 1) + 1)],
        user_array[floor(random() * array_length(user_array, 1) + 1)],
        project_record.id,
        CASE WHEN random() < 0.7 THEN id ELSE NULL END,
        now() - (random() * 7 || ' days')::interval
      FROM tasks
      WHERE project_id = project_record.id
      ORDER BY random()
      LIMIT 1
      ON CONFLICT (id) DO NOTHING;
    END LOOP;
  END LOOP;
END $$;