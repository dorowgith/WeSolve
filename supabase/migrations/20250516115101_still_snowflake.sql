/*
  # Insert Initial Data
  
  1. Mock Data
    - Users with profiles
    - Projects and their settings
    - Project memberships
    - Tasks with assignments
    - Comments and attachments
    - Activity logs
  
  2. Data Structure
    - Uses valid UUIDs for all ID fields
    - Maintains referential integrity
    - Includes realistic timestamps
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
  ('8f9e7d6c-5b4a-3c2b-1d0e-9f8e7d6c5b4a', 'Website Redesign', 'Modernize the company website with a fresh look and improved functionality.', '#3B82F6', 'Marketing', now() - interval '30 days', now()),
  ('7d6c5b4a-3c2b-1d0e-9f8e-7d6c5b4a3c2b', 'Mobile App Development', 'Create a cross-platform mobile application for our customers.', '#14B8A6', 'Development', now() - interval '60 days', now() - interval '2 days'),
  ('6c5b4a3c-2b1d-0e9f-8e7d-6c5b4a3c2b1d', 'Q3 Marketing Campaign', 'Plan and execute the marketing strategy for Q3.', '#F59E0B', 'Marketing', now() - interval '15 days', now() - interval '1 day'),
  ('5b4a3c2b-1d0e-9f8e-7d6c-5b4a3c2b1d0e', 'Product Launch', 'Coordinate all aspects of the new product launch.', '#EC4899', 'Product', now() - interval '45 days', now() - interval '3 days');

-- Insert project members
INSERT INTO project_members (project_id, user_id, role, created_at)
VALUES
  -- Website Redesign members
  ('8f9e7d6c-5b4a-3c2b-1d0e-9f8e7d6c5b4a', 'd7f33635-c9f3-4a6a-8f40-a51e45e4f0fb', 'owner', now()),
  ('8f9e7d6c-5b4a-3c2b-1d0e-9f8e7d6c5b4a', 'c5d6f755-8a3d-4a6c-9b6e-3f5d7e9c8d2a', 'member', now()),
  ('8f9e7d6c-5b4a-3c2b-1d0e-9f8e7d6c5b4a', 'b4e5f645-7a2d-4a6b-8c6d-2f5e7d9c8b2a', 'member', now()),
  
  -- Mobile App Development members
  ('7d6c5b4a-3c2b-1d0e-9f8e-7d6c5b4a3c2b', 'd7f33635-c9f3-4a6a-8f40-a51e45e4f0fb', 'owner', now()),
  ('7d6c5b4a-3c2b-1d0e-9f8e-7d6c5b4a3c2b', 'a3d4e535-6a1d-4a6a-7b6c-1f5d7e9c7b2a', 'member', now()),
  
  -- Q3 Marketing Campaign members
  ('6c5b4a3c-2b1d-0e9f-8e7d-6c5b4a3c2b1d', 'd7f33635-c9f3-4a6a-8f40-a51e45e4f0fb', 'owner', now()),
  ('6c5b4a3c-2b1d-0e9f-8e7d-6c5b4a3c2b1d', 'c5d6f755-8a3d-4a6c-9b6e-3f5d7e9c8d2a', 'member', now()),
  
  -- Product Launch members
  ('5b4a3c2b-1d0e-9f8e-7d6c-5b4a3c2b1d0e', 'd7f33635-c9f3-4a6a-8f40-a51e45e4f0fb', 'owner', now()),
  ('5b4a3c2b-1d0e-9f8e-7d6c-5b4a3c2b1d0e', 'c5d6f755-8a3d-4a6c-9b6e-3f5d7e9c8d2a', 'member', now()),
  ('5b4a3c2b-1d0e-9f8e-7d6c-5b4a3c2b1d0e', 'b4e5f645-7a2d-4a6b-8c6d-2f5e7d9c8b2a', 'member', now()),
  ('5b4a3c2b-1d0e-9f8e-7d6c-5b4a3c2b1d0e', 'a3d4e535-6a1d-4a6a-7b6c-1f5d7e9c7b2a', 'member', now());

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
        status_array[1 + floor(random() * array_length(status_array, 1))],
        priority_array[1 + floor(random() * array_length(priority_array, 1))],
        now() + (random() * 14 || ' days')::interval,
        user_array[1 + floor(random() * array_length(user_array, 1))],
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
          user_array[1 + floor(random() * array_length(user_array, 1))],
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
          user_array[1 + floor(random() * array_length(user_array, 1))],
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
        activity_descriptions[1 + floor(random() * array_length(activity_descriptions, 1))],
        user_array[1 + floor(random() * array_length(user_array, 1))],
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