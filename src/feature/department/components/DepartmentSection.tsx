import { Section } from '@/app/components/layout/Section';
import { getDepartments } from '../service/department.service';
import { DepartmentCard } from './DepartmentCard';
import { departmentGridClass } from './department-grid.styles';

async function DepartmentSection() {
  const departments = await getDepartments();

  if (departments.length === 0) return null;

  return (
    <Section label='Departamentos'>
      <ul className={departmentGridClass}>
        {departments.map((department) => (
          <li key={department.id}>
            <DepartmentCard department={department} />
          </li>
        ))}
      </ul>
    </Section>
  );
}

export { DepartmentSection };
