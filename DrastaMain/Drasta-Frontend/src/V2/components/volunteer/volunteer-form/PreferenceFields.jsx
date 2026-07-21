import { BLOOD_GROUPS, LANGUAGES, ROLES, SKILLS, STATES } from '@/V2/config';
import { SelectField } from './SelectField';

export function PreferenceFields({ register, errors, cities }) {
  return (
    <>
      <SelectField label="Preferred Role" register={register} name="role" options={ROLES} error={errors.role} />
      <SelectField label="Language(s) Spoken" register={register} name="language" options={LANGUAGES} error={errors.language} />
      <SelectField label="Skills" register={register} name="skill" options={SKILLS} error={errors.skill} />
      <SelectField label="Blood Group" register={register} name="blood" options={BLOOD_GROUPS} error={errors.blood} />
      <SelectField label="Preferred State" register={register} name="state" options={STATES} error={errors.state} />
      <SelectField label="Preferred City" register={register} name="city" options={cities} error={errors.city} />
    </>
  );
}