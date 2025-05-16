/*
  # Insert initial data

  This migration inserts the initial mock data into the database.

  1. Data Insertion
    - Insert mock users
    - Insert mock projects
    - Insert project members
    - Insert tasks
    - Insert task comments
    - Insert task attachments
    - Insert activities

  2. Notes
    - All IDs are generated using gen_random_uuid()
    - Timestamps are set using now() with offsets for historical data
    - Foreign key relationships are maintained
*/

-- Insert mock users
INSERT INTO users (id, name, email, avatar_url, created_at, updated_at)
VALUES
  ('d7f33635-c9f3-4a6a-8f40-a51e45e4f0fb', 'John Doe', 'john@example.com', 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', now(), now()),
  ('c5d6f755-8a3d-4a6c-9b6e-3f5d7e9c8d2a', 'Jane Smith', 'jane@example.com', 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', now(), now()),
  ('b4e5f645-7a2d-4a6b-8c6d-2f5e7d9c8b2a', 'Bob Johnson', 'bob@example.com', 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', now(), now()),
  ('a3d4e535-6a1d-4a6a-7b6c-1f5d7e9c7b2a', 'Alice Williams', 'alice@example.com', 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', now(), now());

-- Insert mock projects
INSERT INTO projects (id, name, description, color, category, created_at, updated_at)
VALUES
  ('e8f9g635-h9i3-4j6k-8l40-m51n45o4p0fb', 'Website Redesign', 'Modernize the company website with a fresh look and improved functionality.', '#3B82F6', 'Marketing', now() - interval '30 days', now()),
  ('q9r8s755-t3u4-4v6w-9x6y-z51a45b4c0fb', 'Mobile App Development', 'Create a cross-platform mobile application for our customers.', '#14B8A6', 'Development', now() - interval '60 days', now() - interval '2 days'),
  ('d2e3f645-g4h5-4i6j-8k6l-m51n45o4p0fb', 'Q3 Marketing Campaign', 'Plan and execute the marketing strategy for Q3.', '#F59E0B', 'Marketing', now() - interval '15 days', now() - interval '1 day'),
  ('q7r8s755-t9u0-4v1w-2x3y-z51a45b4c0fb', 'Product Launch', 'Coordinate all aspects of the new product launch.', '#EC4899', 'Product', now() - interval '45 days', now() - interval '3 days');

-- Insert project members
INSERT INTO project_members (project_id, user_id, role, created_at)
VALUES
  -- Website Redesign members
  ('e8f9g635-h9i3-4j6k-8l40-m51n45o4p0fb', 'd7f33635-c9f3-4a6a-8f40-a51e45e4f0fb', 'owner', now()),
  ('e8f9g635-h9i3-4j6k-8l40-m51n45o4p0fb', 'c5d6f755-8a3d-4a6c-9b6e-3f5d7e9c8d2a', 'member', now()),
  ('e8f9g635-h9i3-4j6k-8l40-m51n45o4p0fb', 'b4e5f645-7a2d-4a6b-8c6d-2f5e7d9c8b2a', 'member', now()),
  
  -- Mobile App Development members
  ('q9r8s755-t3u4-4v6w-9x6y-z51a45b4c0fb', 'd7f33635-c9f3-4a6a-8f40-a51e45e4f0fb', 'owner', now()),
  ('q9r8s755-t3u4-4v6w-9x6y-z51a45b4c0fb', 'a3d4e535-6a1d-4a6a-7b6c-1f5d7e9c7b2a', 'member', now()),
  
  -- Q3 Marketing Campaign members
  ('d2e3f645-g4h5-4i6j-8k6l-m51n45o4p0fb', 'd7f33635-c9f3-4a6a-8f40-a51e45e4f0fb', 'owner', now()),
  ('d2e3f645-g4h5-4i6j-8k6l-m51n45o4p0fb', 'c5d6f755-8a3d-4a6c-9b6e-3f5d7e9c8d2a', 'member', now()),
  
  -- Product Launch members
  ('q7r8s755-t9u0-4v1w-2x3y-z51a45b4c0fb', 'd7f33635-c9f3-4a6a-8f40-a51e45e4f0fb', 'owner', now()),
  ('q7r8s755-t9u0-4v1w-2x3y-z51a45b4c0fb', 'c5d6f755-8a3d-4a6c-9b6e-3f5d7e9c8d2a', 'member', now()),
  ('q7r8s755-t9u0-4v1w-2x3y-z51a45b4c0fb', 'b4e5f645-7a2d-4a6b-8c6d-2f5e7d9c8b2a', 'member', now()),
  ('q7r8s755-t9u0-4v1w-2x3y-z51a45b4c0fb', 'a3d4e535-6a1d-4a6a-7b6c-1f5d7e9c7b2a', 'member', now());

-- Insert tasks for each project
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
        status_array[floor(random() * 4 + 1)],
        priority_array[floor(random() * 3 + 1)],
        now() + (random() * 14 || ' days')::interval,
        user_array[floor(random() * 4 + 1)],
        CASE WHEN random() < 0.5 THEN floor(random() * 120) ELSE NULL END,
        now() - (random() * 30 || ' days')::interval,
        now() - (random() * 7 || ' days')::interval
      );

      -- Add some comments to tasks
      IF random() < 0.7 THEN
        INSERT INTO task_comments (
          task_id,
          user_id,
          content,
          created_at
        )
        VALUES (
          task_id,
          user_array[floor(random() * 4 + 1)],
          'This is a comment on task ' || i,
          now() - (random() * 7 || ' days')::interval
        );
      END IF;

      -- Add some attachments to tasks
      IF random() < 0.3 THEN
        INSERT INTO task_attachments (
          task_id,
          name,
          url,
          type,
          size,
          uploaded_by,
          created_at
        )
        VALUES (
          task_id,
          'document-' || i || '.pdf',
          'https://example.com/files/document-' || i || '.pdf',
          'application/pdf',
          floor(random() * 1000000),
          user_array[floor(random() * 4 + 1)],
          now() - (random() * 7 || ' days')::interval
        );
      END IF;
    END LOOP;
  END LOOP;
END $$;

-- Insert activities
DO $$
DECLARE
  project_record RECORD;
  task_record RECORD;
  user_array uuid[] := ARRAY[
    'd7f33635-c9f3-4a6a-8f40-a51e45e4f0fb',
    'c5d6f755-8a3d-4a6c-9b6e-3f5d7e9c8d2a',
    'b4e5f645-7a2d-4a6b-8c6d-2f5e7d9c8b2a',
    'a3d4e535-6a1d-4a6a-7b6c-1f5d7e9c7b2a'
  ];
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
BEGIN
  FOR project_record IN SELECT * FROM projects LOOP
    -- Create 5-10 activities for each project
    FOR i IN 1..floor(random() * 6 + 5)::int LOOP
      INSERT INTO activities (
        description,
        user_id,
        project_id,
        task_id,
        created_at
      )
      SELECT
        activity_descriptions[floor(random() * array_length(activity_descriptions, 1) + 1)],
        user_array[floor(random() * 4 + 1)],
        project_record.id,
        CASE WHEN random() < 0.7 THEN id ELSE NULL END,
        now() - (random() * 7 || ' days')::interval
      FROM tasks
      WHERE project_id = project_record.id
      ORDER BY random()
      LIMIT 1;
    END LOOP;
  END LOOP;
END $$;